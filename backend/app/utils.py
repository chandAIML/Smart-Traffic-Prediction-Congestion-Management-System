import bcrypt

def hash_password(password: str) -> str:
    """Hashes a password using a secure salt via native bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Safely verifies a plain-text password against a stored database hash."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), 
            hashed_password.encode("utf-8")
        )
    except (ValueError, TypeError, AttributeError):
        return False
