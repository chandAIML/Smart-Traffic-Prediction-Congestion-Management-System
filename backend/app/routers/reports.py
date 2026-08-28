from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io, csv
from datetime import datetime, timedelta
from typing import Optional

from ..dependencies import get_db, get_current_user
from .. import models

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/roads")
def list_roads(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Distinct road names, used to populate the report-filter dropdown."""
    rows = db.query(models.TrafficData.road_name).distinct().all()
    return sorted({r[0] for r in rows if r[0]})


@router.get("/traffic-summary")
def traffic_summary(
    days: int = 7,
    road: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    since = datetime.utcnow() - timedelta(days=days)
    query = db.query(models.TrafficData).filter(models.TrafficData.recorded_at >= since)
    if road and road != "All Roads":
        query = query.filter(models.TrafficData.road_name == road)
    records = query.all()

    summary = {}
    for r in records:
        s = summary.setdefault(r.road_name, {"readings": 0, "total_speed": 0, "high_count": 0, "accidents": 0})
        s["readings"] += 1
        s["total_speed"] += r.average_speed
        if r.congestion_level == "High":
            s["high_count"] += 1
        if r.accident:
            s["accidents"] += 1

    return [
        {
            "road_name": road_name,
            "readings": s["readings"],
            "avg_speed": round(s["total_speed"] / s["readings"], 1),
            "high_congestion_count": s["high_count"],
            "accidents": s["accidents"],
        }
        for road_name, s in summary.items()
    ]


@router.get("/generate")
def generate_report(
    days: int = 7,
    road: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """A single combined payload for the Reports page preview: overview
    stat strip + per-road breakdown, for the chosen date range / road filter."""
    since = datetime.utcnow() - timedelta(days=days)
    query = db.query(models.TrafficData).filter(models.TrafficData.recorded_at >= since)
    if road and road != "All Roads":
        query = query.filter(models.TrafficData.road_name == road)
    records = query.all()

    if not records:
        return {
            "generated_at": datetime.utcnow().isoformat(),
            "range_days": days,
            "road_filter": road or "All Roads",
            "total_readings": 0,
            "roads_covered": 0,
            "avg_speed": 0,
            "high_congestion_count": 0,
            "accident_count": 0,
            "breakdown": [],
        }

    per_road = {}
    for r in records:
        s = per_road.setdefault(r.road_name, {"readings": 0, "total_speed": 0, "high_count": 0, "accidents": 0})
        s["readings"] += 1
        s["total_speed"] += r.average_speed
        if r.congestion_level == "High":
            s["high_count"] += 1
        if r.accident:
            s["accidents"] += 1

    breakdown = sorted(
        (
            {
                "road_name": road_name,
                "readings": s["readings"],
                "avg_speed": round(s["total_speed"] / s["readings"], 1),
                "high_congestion_count": s["high_count"],
                "accidents": s["accidents"],
            }
            for road_name, s in per_road.items()
        ),
        key=lambda x: x["high_congestion_count"],
        reverse=True,
    )

    return {
        "generated_at": datetime.utcnow().isoformat(),
        "range_days": days,
        "road_filter": road or "All Roads",
        "total_readings": len(records),
        "roads_covered": len(per_road),
        "avg_speed": round(sum(r.average_speed for r in records) / len(records), 1),
        "high_congestion_count": sum(1 for r in records if r.congestion_level == "High"),
        "accident_count": sum(1 for r in records if r.accident),
        "breakdown": breakdown,
    }


@router.get("/export-csv")
def export_csv(
    days: int = 7,
    road: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    since = datetime.utcnow() - timedelta(days=days)
    query = db.query(models.TrafficData).filter(models.TrafficData.recorded_at >= since)
    if road and road != "All Roads":
        query = query.filter(models.TrafficData.road_name == road)
    records = query.all()

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["road_name", "vehicle_count", "average_speed", "congestion_level", "accident", "recorded_at"])
    for r in records:
        writer.writerow([r.road_name, r.vehicle_count, r.average_speed, r.congestion_level, r.accident, r.recorded_at])
    buffer.seek(0)
    return StreamingResponse(
        buffer, media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=traffic_report.csv"},
    )

