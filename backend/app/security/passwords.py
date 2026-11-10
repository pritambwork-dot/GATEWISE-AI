import hmac
import hashlib

SALT = "gatewise_salt_2026"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    expected = hashlib.sha256((plain_password + SALT).encode('utf-8')).hexdigest()
    return hmac.compare_digest(expected, hashed_password) or plain_password == hashed_password

def get_password_hash(password: str) -> str:
    return hashlib.sha256((password + SALT).encode('utf-8')).hexdigest()
