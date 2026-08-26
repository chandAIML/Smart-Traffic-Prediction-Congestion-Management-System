"""
Seed script to populate traffic_data with realistic historical readings,
so the Analytics and Reports pages show REAL numbers instead of falling
back to demo/sample data.

Run from the Backend directory:
    python seed_traffic_data.py
"""

import sys
import os
import random
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(__file__))

from app.database import engine, SessionLocal, Base
from app.models import TrafficData

Base.metadata.create_all(bind=engine)

ROADS = [
    {"name": "NH-44", "base_speed": 25, "busy": True},
    {"name": "Outer Ring Road", "base_speed": 32, "busy": True},
    {"name": "Anna Salai", "base_speed": 35, "busy": False},
    {"name": "MG Road", "base_speed": 42, "busy": False},
    {"name": "Jubilee Hills Road", "base_speed": 38, "busy": False},
    {"name": "Gachibowli Flyover", "base_speed": 28, "busy": True},
]

WEATHER_OPTIONS = ["Clear", "Clear", "Clear", "Rainy", "Foggy", "Cloudy"]

DAYS_OF_HISTORY = 14


def congestion_from(vehicle_count: int, average_speed: float) -> str:
    speed_ratio = average_speed / 50.0
    if speed_ratio > 0.7 and vehicle_count < 100:
        return "Low"
    elif speed_ratio > 0.4 and vehicle_count < 180:
        return "Medium"
    return "High"


def is_peak_hour(hour: int) -> bool:
    return hour in (8, 9, 18, 19, 20)


def generate_reading(road, hour: int, recorded_at: datetime):
    peak = is_peak_hour(hour)
    congestion_bias = 1.6 if (peak and road["busy"]) else 1.25 if peak else 1.0

    vehicle_count = int(random.uniform(40, 90) * congestion_bias)
    speed_penalty = random.uniform(0.5, 0.85) if peak and road["busy"] else random.uniform(0.75, 1.05)
    average_speed = round(max(8, road["base_speed"] * speed_penalty + random.uniform(-4, 4)), 1)

    congestion_level = congestion_from(vehicle_count, average_speed)
    accident = random.random() < (0.05 if peak and road["busy"] else 0.015)
    weather = random.choice(WEATHER_OPTIONS)

    return TrafficData(
        road_name=road["name"],
        vehicle_count=vehicle_count,
        average_speed=average_speed,
        congestion_level=congestion_level,
        weather=weather,
        accident=accident,
        recorded_at=recorded_at,
    )


def seed():
    db = SessionLocal()
    try:
        existing = db.query(TrafficData).count()
        if existing > 0:
            answer = input(
                f"traffic_data already has {existing} row(s). "
                "Add more seeded rows on top of them? (y/n): "
            ).strip().lower()
            if answer != "y":
                print("Cancelled. No new rows added.")
                return

        now = datetime.utcnow()
        rows = []

        for day_offset in range(DAYS_OF_HISTORY, -1, -1):
            day = now - timedelta(days=day_offset)
            for hour in range(24):
                # Not every road reports every single hour — keeps the
                # heatmap looking like real, slightly patchy sensor data.
                for road in ROADS:
                    if random.random() < 0.85:
                        recorded_at = day.replace(hour=hour, minute=random.randint(0, 59), second=0, microsecond=0)
                        rows.append(generate_reading(road, hour, recorded_at))

        db.add_all(rows)
        db.commit()
        print(f"Seeded {len(rows)} traffic_data rows across {len(ROADS)} roads "
              f"over the last {DAYS_OF_HISTORY} days.")
        print("Restart the backend (if running) and refresh Analytics / Reports.")
    finally:
        db.close()


if __name__ == "__main__":
    random.seed()
    seed()
