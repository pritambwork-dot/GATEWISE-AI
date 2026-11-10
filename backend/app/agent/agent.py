import os
import json
import uuid
import logging
from typing import AsyncGenerator, Dict, Any, List, Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from .config import agent_settings
from .prompts.system_prompt import GATEWISE_SYSTEM_PROMPT
from .security.privacy import sanitize_text, detect_prompt_injection, scrub_sensitive_dict
from .security.permissions import validate_tool_permission, is_tool_authorized
from .security.rate_limiter import rate_limiter
from .runtime.session import session_manager, AgentMessage, AgentSession
from .runtime.streaming import (
    sse_text_delta, sse_tool_start, sse_tool_result,
    sse_action_proposal, sse_navigation, sse_error, sse_done
)
from .tools.schemas import ActionProposal
from .tools import registry as tool_registry

logger = logging.getLogger("gatewise.agent")

class GatewiseAgent:
    """
    Central GATEWISE AI Assistant Engine.
    Executes role-authorized operational tools, preserves human-in-the-loop boundaries,
    and supports streaming SSE delivery with Gemini or high-availability fallback.
    """

    def __init__(self):
        self.api_key = agent_settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
        self.model_name = agent_settings.GEMINI_MODEL
        self.enabled = agent_settings.GATEWISE_ASSISTANT_ENABLED

    def _execute_tool(
        self,
        tool_name: str,
        arguments: Dict[str, Any],
        user_role: str,
        db: Session,
        actor_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Validates permissions, audits execution, and safely executes the requested tool."""
        validate_tool_permission(tool_name, user_role)

        try:
            if tool_name == "get_dashboard_summary":
                res = tool_registry.get_dashboard_summary(db)
            elif tool_name == "get_verification_trends":
                timeframe = arguments.get("timeframe", "today")
                start_date = arguments.get("start_date")
                end_date = arguments.get("end_date")
                res = tool_registry.get_verification_trends(db, timeframe=timeframe, start_date=start_date, end_date=end_date)
            elif tool_name == "get_gate_activity_summary":
                res = tool_registry.get_gate_activity_summary(db)
            elif tool_name == "get_pending_enrollment_summary":
                res = tool_registry.get_pending_enrollment_summary(db)
            elif tool_name == "get_visitor_summary":
                res = tool_registry.get_visitor_summary(db)
            elif tool_name == "get_system_health_summary":
                res = tool_registry.get_system_health_summary(db)
            elif tool_name == "explain_application_workflow":
                topic = arguments.get("topic", "overview")
                res = tool_registry.explain_application_workflow(topic)
            elif tool_name == "explain_status":
                code = arguments.get("status_code", "VERIFIED_AUTHORIZED")
                res = tool_registry.explain_status(code)
            elif tool_name == "navigate_to_page":
                target = arguments.get("target_page", "/admin")
                res = tool_registry.navigate_to_page(target)
            elif tool_name == "propose_gate_status_change":
                proposal = tool_registry.propose_gate_status_change(
                    gate_code=arguments.get("gate_code", "MAIN-01"),
                    new_status=arguments.get("new_status", "MAINTENANCE"),
                    reason=arguments.get("reason", "Administrative review")
                )
                res = {"proposal": proposal.model_dump()}
            elif tool_name == "propose_enrollment_review":
                proposal = tool_registry.propose_enrollment_review(
                    request_id=str(arguments.get("request_id", "REQ-001"))
                )
                res = {"proposal": proposal.model_dump()}
            elif tool_name == "propose_visitor_pass":
                proposal = tool_registry.propose_visitor_pass(
                    visitor_name=arguments.get("visitor_name", "Visitor"),
                    purpose=arguments.get("purpose", "Official Campus Visit"),
                    host_department=arguments.get("host_department", "Administration")
                )
                res = {"proposal": proposal.model_dump()}
            else:
                raise ValueError(f"Unknown tool: '{tool_name}'")

            tool_registry.record_tool_audit(db, actor_id or "admin", tool_name, arguments, "SUCCESS")
            return res
        except Exception as e:
            tool_registry.record_tool_audit(db, actor_id or "admin", tool_name, arguments, "FAILURE")
            raise e

    async def stream_chat(
        self,
        query: str,
        session_id: Optional[str],
        user_id: str,
        user_role: str,
        db: Session
    ) -> AsyncGenerator[str, None]:
        """
        Processes an administrator query and streams SSE events.
        """
        # 1. Screen input for prompt injection & PII
        if detect_prompt_injection(query):
            yield sse_text_delta(
                "Security Notice: System override directives, privilege elevation requests, and unverified prompt injections are blocked by institutional security policy."
            )
            yield sse_done(session_id or "new")
            return

        # 2. Rate limiting check
        rate_limiter.check_rate_limit(user_id)

        cleaned_query = sanitize_text(query)
        session = session_manager.get_or_create_session(session_id, user_id, user_role)
        session.messages.append(AgentMessage(role="user", content=cleaned_query))

        # Check if live Gemini API is configured and operational
        use_gemini = bool(
            self.api_key and
            self.api_key not in ("YOUR_GEMINI_API_KEY", "your-gemini-api-key", "")
        )

        executed_tools: List[Dict[str, Any]] = []
        emitted_proposals: List[Dict[str, Any]] = []
        final_answer = ""

        if use_gemini:
            try:
                # Live Gemini Integration via google-genai
                from google import genai
                from google.genai import types

                client = genai.Client(api_key=self.api_key)

                # Define callable tool wrappers for permitted tools
                available_tools = []

                if is_tool_authorized("get_dashboard_summary", user_role):
                    def get_dashboard_summary() -> str:
                        """Returns aggregated operational statistics for today across campus gates."""
                        return json.dumps(self._execute_tool("get_dashboard_summary", {}, user_role, db))
                    available_tools.append(get_dashboard_summary)

                if is_tool_authorized("get_verification_trends", user_role):
                    def get_verification_trends(timeframe: str = "today") -> str:
                        """Returns aggregated verification throughput trends (timeframe: 'today', '7d', '30d')."""
                        return json.dumps(self._execute_tool("get_verification_trends", {"timeframe": timeframe}, user_role, db))
                    available_tools.append(get_verification_trends)

                if is_tool_authorized("get_gate_activity_summary", user_role):
                    def get_gate_activity_summary() -> str:
                        """Returns operational status and verification counts for each campus gate."""
                        return json.dumps(self._execute_tool("get_gate_activity_summary", {}, user_role, db))
                    available_tools.append(get_gate_activity_summary)

                if is_tool_authorized("get_pending_enrollment_summary", user_role):
                    def get_pending_enrollment_summary() -> str:
                        """Returns count and category breakdown of pending identity enrollment referrals."""
                        return json.dumps(self._execute_tool("get_pending_enrollment_summary", {}, user_role, db))
                    available_tools.append(get_pending_enrollment_summary)

                if is_tool_authorized("get_visitor_summary", user_role):
                    def get_visitor_summary() -> str:
                        """Returns counts of total, checked-in, expected, and expired visitor passes."""
                        return json.dumps(self._execute_tool("get_visitor_summary", {}, user_role, db))
                    available_tools.append(get_visitor_summary)

                if is_tool_authorized("get_system_health_summary", user_role):
                    def get_system_health_summary() -> str:
                        """Returns real-time health status of backend API, database, OpenCV models, and caches."""
                        return json.dumps(self._execute_tool("get_system_health_summary", {}, user_role, db))
                    available_tools.append(get_system_health_summary)

                if is_tool_authorized("explain_application_workflow", user_role):
                    def explain_application_workflow(topic: str) -> str:
                        """Provides institutional SOP definitions (e.g. 'state_d', 'visitor_intake', 'state_b')."""
                        return json.dumps(self._execute_tool("explain_application_workflow", {"topic": topic}, user_role, db))
                    available_tools.append(explain_application_workflow)

                if is_tool_authorized("explain_status", user_role):
                    def explain_status(status_code: str) -> str:
                        """Explains a technical status code (e.g. 'VERIFIED_AUTHORIZED', 'UNKNOWN_PERSON')."""
                        return json.dumps(self._execute_tool("explain_status", {"status_code": status_code}, user_role, db))
                    available_tools.append(explain_status)

                if is_tool_authorized("navigate_to_page", user_role):
                    def navigate_to_page(target_page: str) -> str:
                        """Navigates to an allowlisted administrative page (e.g. '/admin/activity', '/admin/visitors')."""
                        return json.dumps(self._execute_tool("navigate_to_page", {"target_page": target_page}, user_role, db))
                    available_tools.append(navigate_to_page)

                if is_tool_authorized("propose_gate_status_change", user_role):
                    def propose_gate_status_change(gate_code: str, new_status: str, reason: str) -> str:
                        """Prepares an administrative action proposal to modify gate status for human confirmation."""
                        return json.dumps(self._execute_tool("propose_gate_status_change", {"gate_code": gate_code, "new_status": new_status, "reason": reason}, user_role, db))
                    available_tools.append(propose_gate_status_change)

                if is_tool_authorized("propose_enrollment_review", user_role):
                    def propose_enrollment_review(request_id: str) -> str:
                        """Prepares an administrative proposal to review an enrollment referral."""
                        return json.dumps(self._execute_tool("propose_enrollment_review", {"request_id": request_id}, user_role, db))
                    available_tools.append(propose_enrollment_review)

                if is_tool_authorized("propose_visitor_pass", user_role):
                    def propose_visitor_pass(visitor_name: str, purpose: str, host_department: str) -> str:
                        """Prepares an administrative proposal to issue a new visitor pass."""
                        return json.dumps(self._execute_tool("propose_visitor_pass", {"visitor_name": visitor_name, "purpose": purpose, "host_department": host_department}, user_role, db))
                    available_tools.append(propose_visitor_pass)

                config = types.GenerateContentConfig(
                    system_instruction=GATEWISE_SYSTEM_PROMPT,
                    tools=available_tools,
                    temperature=0.2
                )

                response = client.models.generate_content(
                    model=self.model_name,
                    contents=cleaned_query,
                    config=config
                )

                if response.function_calls:
                    for call in response.function_calls:
                        tool_name = call.name
                        args = dict(call.args) if call.args else {}
                        yield sse_tool_start(tool_name, args)
                        
                        tool_res = self._execute_tool(tool_name, args, user_role, db)
                        yield sse_tool_result(tool_name, tool_res)
                        executed_tools.append({"tool": tool_name, "args": args, "result": tool_res})

                        if "proposal" in tool_res:
                            yield sse_action_proposal(tool_res["proposal"])
                            emitted_proposals.append(tool_res["proposal"])

                        if tool_name == "navigate_to_page" and tool_res.get("success"):
                            yield sse_navigation(tool_res["target_page"], tool_res.get("page_title", ""))

                if response.text:
                    final_answer = sanitize_text(response.text)
                    yield sse_text_delta(final_answer)

            except Exception as e:
                logger.warning(f"Gemini API invocation fallback: {e}")
                use_gemini = False

        if not use_gemini or not final_answer:
            # Deterministic High-Availability Fallback Engine
            # Guarantees 100% operational continuity using real database queries
            async for chunk in self._stream_deterministic_fallback(
                query=cleaned_query,
                user_role=user_role,
                db=db,
                executed_tools=executed_tools,
                emitted_proposals=emitted_proposals
            ):
                if chunk.startswith("data: "):
                    try:
                        parsed = json.loads(chunk[6:].strip())
                        if parsed.get("type") == "text_delta":
                            final_answer += parsed.get("delta", "")
                    except Exception:
                        pass
                yield chunk

        # Record assistant reply into session history
        session.messages.append(AgentMessage(
            role="assistant",
            content=final_answer,
            tool_calls=executed_tools if executed_tools else None,
            proposals=emitted_proposals if emitted_proposals else None
        ))

        yield sse_done(session.session_id)

    async def _stream_deterministic_fallback(
        self,
        query: str,
        user_role: str,
        db: Session,
        executed_tools: List[Dict[str, Any]],
        emitted_proposals: List[Dict[str, Any]]
    ) -> AsyncGenerator[str, None]:
        """
        High-availability deterministic execution engine.
        Selects permitted tools based on intent and generates real, authoritative responses.
        """
        q = query.lower()

        # 0. Strict Security Invariants Enforcement
        if any(term in q for term in ["raw identity", "photograph", "photo of", "student's photo", "face embedding", "biometric embedding", "raw embedding", "guard's credential", "credential", "password", "secret key"]):
            yield sse_text_delta(
                "Security Notice: Raw identity records, biometric photographs, facial embeddings, and credentials are encrypted institutional assets and are strictly isolated from the AI Assistant. Access is restricted to authorized personnel via secure admin modules."
            )
            return

        if any(term in q for term in ["approve an identity", "approve identity", "grant entry", "grant access", "deny access", "override gate"]):
            yield sse_text_delta(
                "Security Violation: Autonomous identity approvals and entry grants are strictly prohibited by institutional policy. All gate interventions and enrollment determinations require manual review by authorized human personnel."
            )
            return

        if any(term in q for term in ["unrestricted sql", "select * from", "drop table", "shell execution", "arbitrary shell", "bash", "exec "]):
            yield sse_text_delta(
                "Security Violation: Direct SQL execution and arbitrary command line shell operations are completely blocked by backend security controls."
            )
            return

        # 1. Navigation intents
        if "go to " in q or "open " in q or "navigate" in q:
            target = "/admin"
            title = "Command Center"
            if "visitor" in q:
                target, title = "/admin/visitors", "Visitor Management"
            elif "enrollment" in q or "pending" in q:
                target, title = "/admin/enrollment", "Enrollment Approvals"
            elif "gate" in q:
                target, title = "/admin/gates", "Gate Operations"
            elif "guard" in q:
                target, title = "/admin/guards", "Guard Management"
            elif "activity" in q or "stream" in q or "feed" in q:
                target, title = "/admin/activity", "Live Activity Stream"
            elif "people" in q or "identit" in q or "directory" in q:
                target, title = "/admin/people", "Institutional Identities"
            elif "repository" in q or "drive" in q:
                target, title = "/admin/repository", "Biometrics Repository"
            elif "analytics" in q or "metric" in q:
                target, title = "/admin/analytics", "Campus Analytics"
            elif "setting" in q:
                target, title = "/admin/settings", "System Settings"

            if is_tool_authorized("navigate_to_page", user_role):
                yield sse_tool_start("navigate_to_page", {"target_page": target})
                res = self._execute_tool("navigate_to_page", {"target_page": target}, user_role, db)
                yield sse_tool_result("navigate_to_page", res)
                yield sse_navigation(target, title)
                executed_tools.append({"tool": "navigate_to_page", "args": {"target_page": target}, "result": res})
                yield sse_text_delta(f"Navigating to **{title}** (`{target}`).")
                return

        # 2. Action proposal intents (Human-in-the-loop proposals)
        if "change gate" in q or "maintenance" in q:
            if is_tool_authorized("propose_gate_status_change", user_role):
                gate_code = "MAIN-01"
                if "north" in q:
                    gate_code = "NORTH-01"
                elif "service" in q or "logistics" in q:
                    gate_code = "SERV-01"

                new_status = "MAINTENANCE" if "maintenance" in q else "ACTIVE"
                yield sse_tool_start("propose_gate_status_change", {"gate_code": gate_code, "new_status": new_status})
                res = self._execute_tool("propose_gate_status_change", {
                    "gate_code": gate_code,
                    "new_status": new_status,
                    "reason": "Administrative maintenance proposal"
                }, user_role, db)
                yield sse_tool_result("propose_gate_status_change", res)
                yield sse_action_proposal(res["proposal"])
                emitted_proposals.append(res["proposal"])
                executed_tools.append({"tool": "propose_gate_status_change", "args": {"gate_code": gate_code}, "result": res})

                yield sse_text_delta(
                    f"I have prepared an administrative proposal to transition **Gate {gate_code}** to **{new_status}**.\n\n"
                    "Under institutional policy, state modifications require explicit administrator confirmation. Please review the proposal card below."
                )
                return

        if "review enrollment" in q or "approve enrollment" in q:
            if is_tool_authorized("propose_enrollment_review", user_role):
                req_id = "REQ-001"
                yield sse_tool_start("propose_enrollment_review", {"request_id": req_id})
                res = self._execute_tool("propose_enrollment_review", {"request_id": req_id}, user_role, db)
                yield sse_tool_result("propose_enrollment_review", res)
                yield sse_action_proposal(res["proposal"])
                emitted_proposals.append(res["proposal"])
                executed_tools.append({"tool": "propose_enrollment_review", "args": {"request_id": req_id}, "result": res})

                yield sse_text_delta(
                    "I have prepared an **Enrollment Review Action Proposal** for administrative determination.\n\n"
                    "Please review the applicant's credentials and biometric quality assessment before final sign-off."
                )
                return

        # 3. Operational summaries & metrics
        if "summary" in q or "operation" in q or "today" in q or "overview" in q or "dashboard" in q:
            if is_tool_authorized("get_dashboard_summary", user_role):
                yield sse_tool_start("get_dashboard_summary", {})
                data = self._execute_tool("get_dashboard_summary", {}, user_role, db)
                yield sse_tool_result("get_dashboard_summary", data)
                executed_tools.append({"tool": "get_dashboard_summary", "args": {}, "result": data})

                msg = (
                    "### Institutional Daily Operations Summary\n\n"
                    f"- **Total Gate Scans Today:** **{data['total_scans_today']}**\n"
                    f"- **Authorized Entries:** **{data['authorized_entries']}**\n"
                    f"- **Denied Access Exceptions:** **{data['denied_entries']}**\n"
                    f"- **Administrative Escalations:** **{data['administrative_escalations']}**\n"
                    f"- **Active Campus Visitors:** **{data['active_visitors_on_campus']}**\n"
                    f"- **Pending Identity Referrals:** **{data['pending_enrollment_referrals']}**\n"
                    f"- **Operational Gate Posts:** **{data['active_gates_count']} / {data['total_gates_count']}**\n"
                    f"- **Google Drive Sync:** **{data['last_drive_sync']['status']}**\n\n"
                    "All gate access events are cryptographically authenticated via SHA-256 HMAC seals."
                )
                yield sse_text_delta(msg)
                return

        if "enrollment" in q or "pending" in q:
            if is_tool_authorized("get_pending_enrollment_summary", user_role):
                yield sse_tool_start("get_pending_enrollment_summary", {})
                data = self._execute_tool("get_pending_enrollment_summary", {}, user_role, db)
                yield sse_tool_result("get_pending_enrollment_summary", data)
                executed_tools.append({"tool": "get_pending_enrollment_summary", "args": {}, "result": data})

                cats = data.get("category_breakdown", {})
                cat_str = ", ".join([f"{k}: {v}" for k, v in cats.items()]) if cats else "None"
                msg = (
                    "### Pending Enrollment Status\n\n"
                    f"- **Pending Verification Referrals:** **{data['total_pending_requests']}**\n"
                    f"- **Breakdown:** {cat_str}\n"
                    f"- **SLA Compliance:** Within {data['sla_target_hours']}-hour resolution window.\n\n"
                    "Administrators can review and approve pending enrollments at `/admin/enrollment`."
                )
                yield sse_text_delta(msg)
                return

        if "gate" in q:
            if is_tool_authorized("get_gate_activity_summary", user_role):
                yield sse_tool_start("get_gate_activity_summary", {})
                data = self._execute_tool("get_gate_activity_summary", {}, user_role, db)
                yield sse_tool_result("get_gate_activity_summary", data)
                executed_tools.append({"tool": "get_gate_activity_summary", "args": {}, "result": data})

                gates = data.get("gates", [])
                lines = [f"- **{g['name']}** (`{g['code']}`): Status **{g['status']}**, Scans: **{g['today_scans']}** (Verified: {g['verified_entries']}, Denied: {g['denied_entries']})" for g in gates]
                count_header = f"There are currently **{data.get('active_gate_count', len(gates))} active gates** operational on campus.\n\n"
                msg = f"### Gate Post Operational Status\n\n{count_header}" + "\n".join(lines)
                yield sse_text_delta(msg)
                return

        if "visitor" in q or "guest" in q:
            if is_tool_authorized("get_visitor_summary", user_role):
                yield sse_tool_start("get_visitor_summary", {})
                data = self._execute_tool("get_visitor_summary", {}, user_role, db)
                yield sse_tool_result("get_visitor_summary", data)
                executed_tools.append({"tool": "get_visitor_summary", "args": {}, "result": data})

                msg = (
                    "### Campus Visitor Management Summary\n\n"
                    f"- **Total Registered Passes:** **{data['total_registered_passes']}**\n"
                    f"- **Currently Checked In:** **{data['currently_checked_in']}**\n"
                    f"- **Expected Arrivals:** **{data['expected_arrivals']}**\n"
                    f"- **Expired Passes:** **{data['expired_passes']}**\n"
                    f"- **Campus Visitor Capacity:** **{data['campus_visitor_capacity_percent']}%**\n\n"
                    "New visitor passes can be generated directly from `/admin/visitors`."
                )
                yield sse_text_delta(msg)
                return

        if "health" in q or "system health" in q or "subsystem" in q:
            if is_tool_authorized("get_system_health_summary", user_role):
                yield sse_tool_start("get_system_health_summary", {})
                data = self._execute_tool("get_system_health_summary", {}, user_role, db)
                yield sse_tool_result("get_system_health_summary", data)
                executed_tools.append({"tool": "get_system_health_summary", "args": {}, "result": data})

                cv = data.get("computer_vision_engine", {})
                drive = data.get("google_drive_sync", {})
                msg = (
                    "### GATEWISE Subsystem Health Diagnostics\n\n"
                    f"- **FastAPI Backend:** **{data['backend_api']}**\n"
                    f"- **PostgreSQL DB:** **{data['database_postgresql']}**\n"
                    f"- **Computer Vision Pipeline:** YuNet ({cv.get('yunet_detector')}), SFace ({cv.get('sface_recognizer')})\n"
                    f"- **Biometric Vector Cache:** **{data['vector_cache']['cached_identities']}** enrolled identities loaded\n"
                    f"- **Telemetry Stream:** **{data['event_telemetry']['active_subscribers']}** live terminal subscribers\n"
                    f"- **Google Drive Sync:** **{drive.get('status', 'OPERATIONAL')}**"
                )
                yield sse_text_delta(msg)
                return

        if any(term in q for term in ["seven-day", "7-day", "7 day", "week", "yesterday", "30-day", "30 day", "month", "trend", "traffic", "throughput"]):
            timeframe = "previous_7_days" if ("seven" in q or "7" in q or "week" in q) else ("yesterday" if "yesterday" in q else ("previous_30_days" if ("30" in q or "month" in q) else "today"))
            if is_tool_authorized("get_verification_trends", user_role):
                yield sse_tool_start("get_verification_trends", {"timeframe": timeframe})
                data = self._execute_tool("get_verification_trends", {"timeframe": timeframe}, user_role, db)
                yield sse_tool_result("get_verification_trends", data)
                executed_tools.append({"tool": "get_verification_trends", "args": {"timeframe": timeframe}, "result": data})

                msg = (
                    f"### Institutional Verification Trends ({data['timeframe']})\n\n"
                    f"- **Total Verifications Evaluated:** **{data['total_verifications']}**\n"
                    f"- **Overall Admittance Rate:** **{data['admittance_rate_percent']}%**\n"
                    f"- **Denial / Exception Events:** **{data['denial_count']}**\n"
                    f"- **Peak Traffic Window:** **{data['peak_operational_window']}**\n"
                    f"- **Average Throughput:** **{data['throughput_avg_scans_per_minute']} scans/min**\n\n"
                    "Detailed time-series graphs are available on `/admin/analytics`."
                )
                yield sse_text_delta(msg)
                return

        # 4. Status Explanation
        if "explain status" in q or "explain the status" in q or "status code" in q:
            code = "VERIFIED_AUTHORIZED"
            for candidate in ["potential match", "no verified match", "authorization expired", "pending review", "image quality insufficient", "verification unavailable", "active maintenance"]:
                if candidate in q:
                    code = candidate.upper().replace(" ", "_")
                    break
            if is_tool_authorized("explain_status", user_role):
                yield sse_tool_start("explain_status", {"status_code": code})
                res = self._execute_tool("explain_status", {"status_code": code}, user_role, db)
                yield sse_tool_result("explain_status", res)
                executed_tools.append({"tool": "explain_status", "args": {"status_code": code}, "result": res})
                yield sse_text_delta(f"### Status Definition: {res['status_code']}\n\n{res['explanation']}")
                return

        # 5. Institutional Workflow SOP Guidance
        if any(term in q for term in ["explain", "workflow", "sop", "process", "difference between", "matching and authorization", "unknown-person", "unknown person", "expiry", "blur", "quality", "drive"]):
            if is_tool_authorized("explain_application_workflow", user_role):
                yield sse_tool_start("explain_application_workflow", {"topic": query})
                res = self._execute_tool("explain_application_workflow", {"topic": query}, user_role, db)
                yield sse_tool_result("explain_application_workflow", res)
                executed_tools.append({"tool": "explain_application_workflow", "args": {"topic": query}, "result": res})

                msg = (
                    f"### {res['topic']}\n\n"
                    f"{res['summary']}\n\n"
                    f"**Standard Operating Procedure:**\n{res['protocol']}"
                )
                yield sse_text_delta(msg)
                return

        yield sse_text_delta(
            "I am the GATEWISE AI Operations Assistant. You can ask me to summarize today's gate operations, "
            "inspect pending identity enrollments, check visitor statistics, review system health, or prepare administrative proposals."
        )

agent_service = GatewiseAgent()
