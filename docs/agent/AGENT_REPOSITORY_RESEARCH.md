# GATEWISE AI — Agent Framework & Repository Research
**Document Version:** 1.0.0  
**Status:** Approved for Production Architecture  
**Lead AI Systems Architect:** GATEWISE AI Core Engineering  

---

## Executive Summary

To deliver the **GATEWISE AI Assistant** as an institutional co-pilot for the Desktop Administrator Portal, we conducted an in-depth technical evaluation of modern AI agent frameworks, official Google LLM SDKs, and streaming UI libraries. 

Our core architectural requirement is uncompromising: **The AI Assistant must serve as an intelligent, read-mostly co-pilot that leverages backend authority, never exposes biometric data or raw PII, and never exercises autonomous administrative authority (e.g. admitting persons, modifying access policies, or approving identities).**

This document establishes our technical evaluation of:
1. **Google Agent Development Kit (ADK)** (`google-adk`, `adk.dev`)
2. **Google Gen AI Python SDK** (`google-genai`, `googleapis/python-genai`)
3. **assistant-ui** (`@assistant-ui/react`)
4. **AG-UI Protocol** (`ag-ui-protocol/ag-ui`)
5. **Agno** (`agno-agi/agno`)

---

## 1. Google Agent Development Kit (ADK)

* **Repository:** `https://github.com/google/adk-python`
* **Documentation:** `https://adk.dev/`
* **Evaluated Version:** `google-adk==2.14.0` (Python 3.13 verified)

### 1.1 Architecture & Core Strengths
- **Native Gemini Optimization:** ADK is purpose-built by Google for the Gemini ecosystem, providing native integration with Gemini tool schemas and function calling protocols.
- **Declarative Tool Registration:** Tools are defined with typed Pydantic parameter schemas, auto-generating compliant OpenAPI/JSON schemas for Gemini.
- **Workflow & Context Management:** Provides explicit `Context` and `Runner` abstractions to manage multi-turn session state, function invocation loops, and step execution.
- **Human-in-the-Loop Hooks:** First-class support for confirmation barriers before executing sensitive tools or emitting proposal artifacts.

### 1.2 Evaluation & Adoption Decision
* **Decision:** **ADOPTED AS PRIMARY AGENT SPECIFICATION AND ORCHESTRATION ENGINE**.
* **Adopted Patterns:**
  - Typed Tool Decorators and Pydantic parameter validation schemas.
  - Deterministic Tool Execution Loop with strict role-based access gates.
  - Two-phase execution pattern: **Read Tools** execute immediately and return aggregate data; **Mutation Tools** generate structured `ActionProposal` objects for administrator confirmation.
* **Compatibility Notes:**
  - Verified installation on Python 3.13.5 with `google-adk==2.14.0` and `google-genai==2.34.0`.

---

## 2. Google Gen AI Python SDK

* **Repository:** `https://github.com/googleapis/python-genai`
* **Evaluated Version:** `google-genai==2.34.0`

### 2.1 Architecture & Core Strengths
- **Modern Unified API:** Replaces legacy `google-generativeai` with a single, production-hardened client (`from google import genai`).
- **First-Class Function Calling:** Seamless conversion between Python callables and Gemini function declarations via `types.Tool(function_declarations=...)` and automatic response routing.
- **Streaming & Async Native:** Supports asynchronous token and tool-call streaming (`client.aio.models.generate_content_stream`).
- **Robust Error Handling:** Granular exceptions for API key validation, rate limits (HTTP 429), quota exhaustion, and safety filters.

### 2.2 Evaluation & Adoption Decision
* **Decision:** **ADOPTED AS THE DIRECT LOW-LEVEL GEMINI CONNECTOR**.
* **Adopted Patterns:**
  - Backend-only API key binding (`os.environ["GEMINI_API_KEY"]` or settings). Zero frontend key exposure.
  - Model selection default: `gemini-1.5-flash` (balanced low-latency, free-tier compliance, rich function calling).
  - Explicit rate-limit & quota fallbacks: When the free-tier rate limit is exceeded or offline, the system degrades gracefully to deterministic institutional SOP guidance without crashing.

---

## 3. assistant-ui

* **Repository:** `https://github.com/assistant-ui/assistant-ui`
* **Documentation:** `https://www.assistant-ui.com/docs/`
* **Evaluated Version:** `@assistant-ui/react==0.15.34`

### 3.1 Architecture & Core Strengths
- **Headless React Primitives:** Provides composable, highly customizable React primitives for AI chats (`Thread`, `Message`, `Composer`, `ToolCall`).
- **Rich Tool Call & Proposal Rendering:** Built-in hooks to render tool invocation states (pending, running, complete) and custom UI blocks for action proposals.
- **Streaming Adapter Protocol:** Connects seamlessly to standard Server-Sent Events (SSE) or custom streaming endpoints.
- **Design Token Compatibility:** Headless architecture enables complete adherence to the GATEWISE Apple-grade design language (emerald `#0F5A47`, mint `#22C55E`, crisp `#FFFFFF` cards, refined typography).

### 3.2 Evaluation & Adoption Decision
* **Decision:** **ADOPTED FOR DESKTOP ADMIN PORTAL ASSISTANT INTERFACE**.
* **Adopted Patterns:**
  - Collapsible slide-over assistant drawer accessible across all `/admin/*` routes.
  - Streaming SSE communication with real-time token rendering.
  - Dedicated `ToolExecutionCard` showing administrative data fetches.
  - Dedicated `ActionProposalCard` with interactive deep links to standard administrative views (e.g., Review Enrollment, Issue Visitor Pass, Toggle Gate Maintenance).

---

## 4. AG-UI Protocol

* **Repository:** `https://github.com/ag-ui-protocol/ag-ui`

### 4.1 Evaluation
- Evaluated as a potential event protocol for streaming agent states and interactive UI components.
- **Finding:** While conceptually sound, introducing a dedicated custom protocol adds unnecessary complexity and external runtime dependencies when `@assistant-ui/react` and standard SSE stream contracts already fulfill 100% of the GATEWISE real-time requirements.
* **Decision:** **REJECTED (AVOID PROTOCOL PROLIFERATION)**. Standardized on SSE JSON-RPC event frames (`type: "text_delta"`, `type: "tool_start"`, `type: "tool_result"`, `type: "action_proposal"`, `type: "done"`).

---

## 5. Agno

* **Repository:** `https://github.com/agno-agi/agno`

### 5.1 Evaluation
- Evaluated as an alternative multi-agent framework.
- **Finding:** Agno introduces heavyweight database abstractions, vector storage connectors, and multi-agent routing that overlap with our existing PostgreSQL + pgvector repository layer and OpenCV pipeline.
* **Decision:** **REJECTED FOR CORE RUNTIME**. We adopted Agno's patterns for *Strict Tool Scoping* and *Human Approval Cards*, while keeping our core dependencies clean and centered on Google ADK + GenAI SDK.

---

## Summary of Adopted vs. Rejected Components

| Component / Library | Status | Key Rationale |
| :--- | :---: | :--- |
| **`google-adk` (2.14.0)** | **ADOPTED** | Official Google agent framework, native Gemini tool calling, structured Pydantic tools. |
| **`google-genai` (2.34.0)** | **ADOPTED** | Modern unified Google GenAI client, robust function calling, streaming tokens. |
| **`@assistant-ui/react`** | **ADOPTED** | Apple-grade React chat UI primitives, streaming adapter, tool rendering. |
| **AG-UI Protocol** | **REJECTED** | Redundant over standard Server-Sent Events (SSE). |
| **Agno Framework** | **REJECTED** | Heavyweight monolithic stack; unnecessary overhead for single co-pilot agent. |

---

## Safety & Security Invariants Enforced in Code

1. **Zero Autonomous Privilege:** The assistant has **zero** write-privileges on gate access, facial matches, or identity creation. All administrative actions are output as human proposals.
2. **Zero Raw Biometric Exposure:** OpenCV embeddings, face crops, and biometric templates are physically isolated from the agent runtime. Tool outputs are strictly aggregated statistics.
3. **Role-Based Tool Authorization:** Tools require active `ADMIN` or `SUPER_ADMIN` JWT credentials; unauthorized users receive an immediate HTTP 403.
4. **Quota & Offline Fallback:** If Gemini API key is missing or quota is exhausted, the agent automatically degrades to deterministic institutional SOP guidance.
