from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..utils import hash_password, verify_password
from ..dependencies import (
    get_db,
    get_current_user,
    admin_required,
    operator_required,
    commuter_required
)
from .. import models, schemas
from ..auth_handler import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ============================================================
# REGISTER
# ============================================================

@router.post("/register", response_model=schemas.UserResponse)
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    # Check if email already exists
    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = models.User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ============================================================
# NORMAL LOGIN
# Used by frontend
# ============================================================

@router.post("/login")
def login(
    user: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    # Find user by email
    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": db_user.role,
        "username": db_user.username,
        "email": db_user.email
    }


# ============================================================
# OAUTH2 TOKEN LOGIN
# Used by Swagger Authorize
# ============================================================

@router.post("/token")
def token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Swagger sends the email through the "username" field
    db_user = db.query(models.User).filter(
        models.User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ============================================================
# CURRENT USER
# ============================================================

@router.get(
    "/me",
    response_model=schemas.UserResponse
)
def me(
    current_user=Depends(get_current_user)
):
    return current_user


# ============================================================
# ADMIN
# ============================================================

@router.get("/admin")
def admin_dashboard(
    current_user=Depends(admin_required)
):
    return {
        "message": f"Welcome Admin {current_user.username}"
    }


# ============================================================
# OPERATOR
# ============================================================

@router.get("/operator")
def operator_dashboard(
    current_user=Depends(operator_required)
):
    return {
        "message": f"Welcome Operator {current_user.username}"
    }


# ============================================================
# COMMUTER
# ============================================================

@router.get("/commuter")
def commuter_dashboard(
    current_user=Depends(commuter_required)
):
    return {
        "message": f"Welcome {current_user.username}"
    }