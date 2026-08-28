from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from collections import defaultdict

from ..dependencies import get_db, get_current_user
from .. import models

router = APIRouter(prefix="/analytics", tags=["Analytics"])

CONGESTION_SCORE = {"Low": 1, "Medium": 2, "High": 3}


@router.get("/overview")
def analytics_overview(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Top-level stat cards: roads monitored, avg speed, high-congestion roads, accidents."""
    since = datetime.utcnow() - timedelta(days=days)
    records = db.query(models.TrafficData).filter(models.TrafficData.recorded_at >= since).all()

    if not records:
        return {
            "roads_monitored": 0,
            "avg_speed": 0,
            "high_congestion_roads": 0,
            "accident_reports": 0,
        }

    roads = {r.road_name for r in records}
    avg_speed = round(sum(r.average_speed for r in records) / len(records), 1)
    high_roads = {r.road_name for r in records if r.congestion_level == "High"}
    accidents = sum(1 for r in records if r.accident)

    return {
        "roads_monitored": len(roads),
        "avg_speed": avg_speed,
        "high_congestion_roads": len(high_roads),
        "accident_reports": accidents,
    }


@router.get("/heatmap")
def congestion_heatmap(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Road x hour-of-day grid of average congestion score, for a heatmap grid."""
    since = datetime.utcnow() - timedelta(days=days)
    records = db.query(models.TrafficData).filter(models.TrafficData.recorded_at >= since).all()

    grid = defaultdict(lambda: defaultdict(list))
    for r in records:
        hour = r.recorded_at.hour
        grid[r.road_name][hour].append(CONGESTION_SCORE.get(r.congestion_level, 1))

    result = []
    for road, hours in grid.items():
        cells = []
        for hour in range(24):
            values = hours.get(hour, [])
            avg_score = round(sum(values) / len(values), 2) if values else None
            cells.append({"hour": hour, "avg_congestion_score": avg_score})
        result.append({"road_name": road, "cells": cells})

    return result


@router.get("/trend")
def traffic_trend(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Daily average speed & congestion score across all roads, for a line/area chart."""
    since = datetime.utcnow() - timedelta(days=days)
    records = db.query(models.TrafficData).filter(models.TrafficData.recorded_at >= since).all()

    daily = defaultdict(lambda: {"speed_sum": 0.0, "score_sum": 0, "count": 0})
    for r in records:
        day_key = r.recorded_at.strftime("%Y-%m-%d")
        d = daily[day_key]
        d["speed_sum"] += r.average_speed
        d["score_sum"] += CONGESTION_SCORE.get(r.congestion_level, 1)
        d["count"] += 1

    trend = [
        {
            "date": day,
            "avg_speed": round(d["speed_sum"] / d["count"], 1),
            "avg_congestion_score": round(d["score_sum"] / d["count"], 2),
            "readings": d["count"],
        }
        for day, d in sorted(daily.items())
    ]
    return trend


@router.get("/road-performance")
def road_performance(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Ranked road-by-road performance table."""
    since = datetime.utcnow() - timedelta(days=days)
    records = db.query(models.TrafficData).filter(models.TrafficData.recorded_at >= since).all()

    per_road = defaultdict(lambda: {"speed_sum": 0.0, "count": 0, "high": 0, "accidents": 0})
    for r in records:
        p = per_road[r.road_name]
        p["speed_sum"] += r.average_speed
        p["count"] += 1
        if r.congestion_level == "High":
            p["high"] += 1
        if r.accident:
            p["accidents"] += 1

    performance = [
        {
            "road_name": road,
            "avg_speed": round(p["speed_sum"] / p["count"], 1),
            "readings": p["count"],
            "high_congestion_pct": round((p["high"] / p["count"]) * 100, 1),
            "accidents": p["accidents"],
        }
        for road, p in per_road.items()
    ]
    performance.sort(key=lambda x: x["high_congestion_pct"], reverse=True)
    return performance


@router.get("/insights")
def historical_insights(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Short human-readable historical insight summaries."""
    since = datetime.utcnow() - timedelta(days=days)
    records = db.query(models.TrafficData).filter(models.TrafficData.recorded_at >= since).all()

    if not records:
        return {"insights": ["No traffic data recorded yet for this period."]}

    per_road = defaultdict(lambda: {"high": 0, "count": 0})
    per_hour = defaultdict(int)
    for r in records:
        per_road[r.road_name]["count"] += 1
        if r.congestion_level == "High":
            per_road[r.road_name]["high"] += 1
        per_hour[r.recorded_at.hour] += 1

    most_congested = max(
        per_road.items(),
        key=lambda kv: (kv[1]["high"] / kv[1]["count"]) if kv[1]["count"] else 0,
    )[0]
    peak_hour = max(per_hour.items(), key=lambda kv: kv[1])[0] if per_hour else None
    accident_count = sum(1 for r in records if r.accident)

    insights = [
        f"{most_congested} recorded the highest share of high-congestion readings in the last {days} day(s).",
    ]
    if peak_hour is not None:
        insights.append(f"Peak monitoring activity was around {peak_hour}:00 hrs.")
    insights.append(f"{accident_count} accident report(s) logged in this period.")

    return {"insights": insights}
