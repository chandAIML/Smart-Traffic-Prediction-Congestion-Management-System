from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import select

from .database import SessionLocal
from .auth_handler import verify_access_token
from . import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_db() -> Generator[Session, None, None]:
    """Manages database session lifecycle."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    """Authenticates the token and retrieves the current user."""
    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    email = payload.get("sub")

    user = db.execute(
        select(models.User).where(models.User.email == email)
    ).scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user


class RoleChecker:
    """Reusable class to handle clean role-based permissions in FastAPI."""
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: models.User = Depends(get_current_user)) -> models.User:
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of these roles: {', '.join(self.allowed_roles)}"
            )
        return current_user


# Cleaner, modern dependency definitions for endpoint
admin_required = RoleChecker(["admin"])
operator_required = RoleChecker(["admin", "operator"])  # Admins can access operator routes safely
commuter_required = RoleChecker(["commuter"])
