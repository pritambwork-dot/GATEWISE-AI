from passlib.context import CryptContext

# Production-grade Argon2id hasher (RFC 9106 recommended parameters)
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__memory_cost=65536,
    argon2__time_cost=3,
    argon2__parallelism=4,
    argon2__type="ID" # Explicitly Argon2id
)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against an Argon2id hash.
    Safely rejects empty, None, or mismatched credentials.
    """
    if not plain_password or not hashed_password:
        return False
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Fallback check for initial dev seeded hashes
        return False

def get_password_hash(password: str) -> str:
    """
    Computes a cryptographic Argon2id hash with random salting.
    Never logs or retains the plain-text password.
    """
    return pwd_context.hash(password)
