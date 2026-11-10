import re
from typing import Any, Dict, List, Union

# Patterns for sensitive data screening
AADHAAR_PATTERN = re.compile(r"\b\d{4}[ -]?\d{4}[ -]?\d{4}\b")
PHONE_PATTERN = re.compile(r"\b(?:\+91|0)?[6-9]\d{9}\b")
JWT_PATTERN = re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]{10,}\b")
API_KEY_PATTERN = re.compile(r"\b(?:AIza|sk-|Bearer\s+)[A-Za-z0-9_-]{16,}\b", re.IGNORECASE)
VECTOR_ARRAY_PATTERN = re.compile(r"\[\s*-?\d+\.\d{3,}(?:,\s*-?\d+\.\d{3,}){5,}\s*\]")

# Prompt injection risk signatures
INJECTION_SIGNATURES = [
    r"ignore (all )?previous instructions",
    r"system override",
    r"you are now in developer mode",
    r"bypass safety",
    r"output raw embeddings",
    r"grant access to all gates",
    r"elevate my privileges",
    r"drop database",
    r"select \* from",
]

def detect_prompt_injection(text: str) -> bool:
    """Detects obvious prompt injection or jailbreak attempts."""
    lower_text = text.lower()
    for sig in INJECTION_SIGNATURES:
        if re.search(sig, lower_text):
            return True
    return False

def sanitize_text(text: str) -> str:
    """Redacts PII, tokens, and raw biometric vector strings from text."""
    if not text:
        return text
    
    cleaned = AADHAAR_PATTERN.sub("[REDACTED-ID]", text)
    cleaned = PHONE_PATTERN.sub("[REDACTED-PHONE]", cleaned)
    cleaned = JWT_PATTERN.sub("[REDACTED-TOKEN]", cleaned)
    cleaned = API_KEY_PATTERN.sub("[REDACTED-KEY]", cleaned)
    cleaned = VECTOR_ARRAY_PATTERN.sub("[REDACTED-BIOMETRIC-VECTOR]", cleaned)
    return cleaned

def scrub_sensitive_dict(data: Union[Dict[str, Any], List[Any], Any]) -> Any:
    """Recursively redacts sensitive keys and values from tool outputs."""
    sensitive_keys = {
        "password", "hashed_password", "token", "secret", "embedding",
        "raw_vector", "biometric_vector", "face_crop_base64", "aadhaar_number",
        "phone_number", "mobile_number", "pin"
    }
    
    if isinstance(data, dict):
        sanitized = {}
        for k, v in data.items():
            if k.lower() in sensitive_keys:
                sanitized[k] = "[REDACTED]"
            else:
                sanitized[k] = scrub_sensitive_dict(v)
        return sanitized
    elif isinstance(data, list):
        return [scrub_sensitive_dict(item) for item in data]
    elif isinstance(data, str):
        return sanitize_text(data)
    return data
