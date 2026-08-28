
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.dependencies import get_db, get_current_user, operator_required


router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)


# ============================================================
# CREATE MANUAL ALERT
# ============================================================

@router.post("/", response_model=schemas.AlertResponse)
def create_alert(
    alert: schemas.AlertCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_alert = models.Alert(
        alert_type=alert.alert_type,
        description=alert.description,
        location=alert.location,
        latitude=alert.latitude,
        longitude=alert.longitude,
        severity=alert.severity,
        status="Active",
        reported_by=current_user.id
    )

    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)

    return new_alert


# ============================================================
# GET ALL ALERTS
# ============================================================

@router.get("/", response_model=list[schemas.AlertResponse])
def get_alerts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return (
        db.query(models.Alert)
        .order_by(models.Alert.created_at.desc())
        .all()
    )


# ============================================================
# GET ACTIVE ALERTS
# ============================================================

@router.get("/active", response_model=list[schemas.AlertResponse])
def get_active_alerts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return (
        db.query(models.Alert)
        .filter(models.Alert.status != "Resolved")
        .order_by(models.Alert.created_at.desc())
        .all()
    )


# ============================================================
# ACKNOWLEDGE ALERT
# Only Admin and Operator
# ============================================================

@router.patch(
    "/{alert_id}/acknowledge",
    response_model=schemas.AlertResponse
)
def acknowledge_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(operator_required)
):
    alert = (
        db.query(models.Alert)
        .filter(models.Alert.id == alert_id)
        .first()
    )

    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    if alert.status == "Resolved":
        raise HTTPException(
            status_code=400,
            detail="Resolved alert cannot be acknowledged"
        )

    alert.status = "Acknowledged"
    alert.acknowledged_at = datetime.utcnow()

    db.commit()
    db.refresh(alert)

    return alert


# ============================================================
# RESOLVE ALERT
# Only Admin and Operator
# ============================================================

@router.patch(
    "/{alert_id}/resolve",
    response_model=schemas.AlertResponse
)
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(operator_required)
):
    alert = (
        db.query(models.Alert)
        .filter(models.Alert.id == alert_id)
        .first()
    )

    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    if alert.status == "Resolved":
        raise HTTPException(
            status_code=400,
            detail="Alert is already resolved"
        )

    alert.status = "Resolved"
    alert.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(alert)

    return alert


# ============================================================
# DELETE ALERT
# Only Admin and Operator
# ============================================================

@router.delete("/{alert_id}")
def delete_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(operator_required)
):
    alert = (
        db.query(models.Alert)
        .filter(models.Alert.id == alert_id)
        .first()
    )

    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    db.delete(alert)
    db.commit()

    return {"detail": "Alert deleted successfully"}


# ============================================================
# UPDATE ALERT
# Only Admin and Operator
# ============================================================

@router.put("/{alert_id}", response_model=schemas.AlertResponse)
def update_alert(
    alert_id: int,
    alert_update: schemas.AlertCreate,
    db: Session = Depends(get_db),
    current_user=Depends(operator_required)
):
    alert = (
        db.query(models.Alert)
        .filter(models.Alert.id == alert_id)
        .first()
    )

    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    alert.alert_type = alert_update.alert_type
    alert.description = alert_update.description
    alert.location = alert_update.location
    if alert_update.severity:
        alert.severity = alert_update.severity

    db.commit()
    db.refresh(alert)

    return alert