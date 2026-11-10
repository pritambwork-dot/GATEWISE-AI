"""
Gemini Operational SOP Client Interface
Provides backend-only contextual standard operating procedure (SOP) guidance for guards.
STRICT PRIVACY POLICY: Zero biometric images, vectors, or identities are transmitted to Gemini.
"""
import os
from typing import Optional
from ..core.logging import logger

class GeminiSOPClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.is_configured = bool(self.api_key and self.api_key != "YOUR_GEMINI_API_KEY")

    def query_sop(self, user_query: str) -> str:
        """
        Executes policy lookups.
        Falls back to deterministic institutional security rules if API key is not present.
        """
        if not self.is_configured:
            logger.info("GEMINI_API_KEY not configured. Utilizing deterministic institutional SOP rules.")
            return (
                "GATEWISE Operational Advisory (Institutional Policy):\n"
                "1. If a student or visitor is unrecognized, request government-issued photo ID and issue a Walk-in Pass in the Visitors tab.\n"
                "2. If an identity is verified but term clearance is expired, deny admittance and refer individual to the Registrar.\n"
                "3. In cases of camera blur, instruct subject to remain still within the 1.2m–1.5m guide reticle."
            )
        
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(
                f"You are the GATEWISE AI Operational Assistant for IIM Sambalpur Campus Security. Answer this guard policy question concisely without disclosing internal systems:\n\n{user_query}"
            )
            return response.text.strip()
        except Exception as e:
            logger.warning(f"Gemini API request failed: {e}. Falling back to standard SOP.")
            return "Standard Guard Protocol: Refer unverified visitors to the Visitor Intake Desk with government ID."
