from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from ..dependencies import get_db, get_current_user, operator_required
from .. import models, schemas

router = APIRouter(prefix="/traffic", tags=["Traffic"])


def calculate_congestion(vehicle_count: int, average_speed: float) -> str:
    speed_ratio = average_speed / 50.0
    if speed_ratio > 0.7 and vehicle_count < 100:
        return "Low"
    elif speed_ratio > 0.4 and vehicle_count < 180:
        return "Medium"
    return "High"


@router.post("/ingest", response_model=schemas.TrafficDataOut)
def ingest_traffic(
    payload: schemas.TrafficDataIn,
    db: Session = Depends(get_db),
    current_user=Depends(operator_required),
):
    congestion = calculate_congestion(payload.vehicle_count, payload.average_speed)
    entry = models.TrafficData(
        road_name=payload.road_name,
        vehicle_count=payload.vehicle_count,
        average_speed=payload.average_speed,
        congestion_level=congestion,
        weather=payload.weather,
        accident=payload.accident,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/live", response_model=list[schemas.TrafficDataOut])
def live_traffic(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    subq = (
        db.query(models.TrafficData.road_name, func.max(models.TrafficData.id).label("max_id"))
        .group_by(models.TrafficData.road_name)
        .subquery()
    )
    return db.query(models.TrafficData).join(subq, models.TrafficData.id == subq.c.max_id).all()


@router.get("/history/{road_name}", response_model=list[schemas.TrafficDataOut])
def road_history(road_name: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return (
        db.query(models.TrafficData)
        .filter(models.TrafficData.road_name == road_name)
        .order_by(desc(models.TrafficData.recorded_at))
        .limit(50)
        .all()
    )
