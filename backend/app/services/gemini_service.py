import os
from typing import Optional
from ..core.config import settings

GATEWISE_INSTITUTIONAL_SOP = """
You are the GATEWISE AI Operational Assistant for IIM Sambalpur Campus Security.
Your purpose is to answer security guard and administrative queries regarding institutional gate protocols, visitor admittance SOPs, incident escalations, and operating hours.

Key Institutional Rules:
1. Student & Faculty Admittance:
   - Must be verified via face recognition with matching institutional authorization.
   - If an identity is verified but authorization is expired (State B/F), the guard must DENY entry or ESCALATE to Registrar. The guard cannot manually override without written clearance.
2. Unidentified Persons (State D):
   - Direct to the Visitor Reception Desk or initiate walk-in visitor intake pass generation with photo ID.
3. Quality Insufficient (State E):
   - Instruct the individual to stand 1.2 to 1.5 meters away, remove sunglasses/masks, and face the daylight camera without backlighting.
4. Shift Operating Hours:
   - Main Campus Gate (Post 01 & 02): 24/7 continuous operation.
   - North Academic Gate (Post 03): 06:00 to 22:00.
   - Service & Logistics Gate (Post 04): 07:00 to 19:00 (Contractors & Deliveries only).
5. Data Privacy & Biometrics:
   - Biometric vectors and facial images are strictly confidential and stored on encrypted institutional servers. Never disclose personal data.
"""

def query_operational_assistant(query: str, context: Optional[str] = None) -> str:
    """
    Backend-only SOP query assistant.
    Strictly accepts text queries regarding security protocols.
    Zero biometric data or images are ever passed.
    """
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
    if api_key and api_key != "YOUR_GEMINI_API_KEY":
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"{GATEWISE_INSTITUTIONAL_SOP}\n\nSecurity Officer Query: {query}"
            if context:
                prompt += f"\nCurrent Operational Context: {context}"
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            # Fall back to deterministic rule guidance
            pass

    # Intelligent deterministic SOP response engine
    q = query.lower()
    if "unauthorized" in q or "expired" in q:
        return (
            "Protocol for Expired / Unauthorized Identity (State B/F):\n"
            "1. Inform the individual that their institutional clearance has lapsed.\n"
            "2. Under standard security regulations, do NOT grant entry without verification.\n"
            "3. Refer them to the Academic Affairs Office or Registrar to renew their campus clearance card.\n"
            "4. Log an exception report by selecting 'Deny Entry' on your terminal."
        )
    elif "visitor" in q or "guest" in q or "walk-in" in q:
        return (
            "Protocol for Visitor & Walk-In Intake:\n"
            "1. Request government-issued photo identification (Aadhaar, Passport, Driving License).\n"
            "2. Confirm the host faculty/department name and contact phone.\n"
            "3. Navigate to the 'Visitors' tab on your terminal and create a Walk-In Pass with pass code generation.\n"
            "4. Issue physical visitor badge and instruct them to sign out at departure."
        )
    elif "blur" in q or "quality" in q or "light" in q or "camera" in q:
        return (
            "Protocol for Camera Quality Issues (State E):\n"
            "1. Ensure subject is positioned within 1.2m - 1.5m from the camera.\n"
            "2. In low-light environments, tap the flashlight toggle icon in the top right of the viewfinder.\n"
            "3. Check for severe backlighting from afternoon sun or floodlights; re-angle the tablet if necessary.\n"
            "4. Ask the subject to look directly into the camera lens with a neutral expression."
        )
    elif "escalat" in q or "admin" in q:
        return (
            "Protocol for Administrative Escalation (State D / Incident):\n"
            "1. Select 'Request Administrator Review' on the result screen.\n"
            "2. A real-time notification will be pushed to the Central Command Centre.\n"
            "3. Request the individual to wait in the Gate Post Waiting Area while the supervisor reviews the referral."
        )
    else:
        return (
            "GATEWISE Operational Advisory:\n"
            "All entry decisions are recorded with an immutable SHA-256 cryptographic signature. "
            "Guards must verify that the live person matches the approved reference photo before tapping 'Grant Entry'. "
            "For urgent security incidents or perimeter alerts, contact Central Security Control at ext. 4444."
        )
