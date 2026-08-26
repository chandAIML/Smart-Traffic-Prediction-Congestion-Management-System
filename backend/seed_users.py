"""
Seed script to reset and insert default users and demo alerts into users.db.
Run from the Backend directory:  python seed_users.py
"""

import sys
import os

# Make sure the app package is importable
sys.path.insert(0, os.path.dirname(__file__))

from app.database import engine, SessionLocal, Base
from app.models import User, Alert
from app.utils import hash_password

# Ensure tables exist
Base.metadata.create_all(bind=engine)

USERS = [
    {
        "username": "Vikas",
        "email": "vikas@gmail.com",
        "password": "123456",
        "role": "admin",
    },
    {
        "username": "Archee",
        "email": "archee@gmail.com",
        "password": "123456",
        "role": "operator",
    },
    {
        "username": "User",
        "email": "user@gmail.com",
        "password": "123456",
        "role": "commuter",
    },
    {
        "username": "Sri",
        "email": "Srilekha@gmail.com",
        "password": "123456",
        "role": "admin",
    },
    {
        "username": "Chandini",
        "email": "chandini@gmail.com",
        "password": "123456",
        "role": "commuter",
    },
]

DEMO_ALERTS = [
    {
        "alert_type": "Accident",
        "description": "Accident reported near NH-24 causing slowdown.",
        "location": "NH-24, Ghaziabad",
        "severity": "High",
        "status": "Active",
    },
    {
        "alert_type": "Traffic Congestion",
        "description": "Heavy traffic near Sector 62 during peak hours.",
        "location": "Sector 62, Noida",
        "severity": "Medium",
        "status": "Active",
    },
    {
        "alert_type": "Road Blockage",
        "description": "Road blockage near Indirapuram due to construction.",
        "location": "Indirapuram, Ghaziabad",
        "severity": "High",
        "status": "Active",
    },
    {
        "alert_type": "Road Hazard",
        "description": "Pothole reported near Kaushambi metro station.",
        "location": "Kaushambi",
        "severity": "Low",
        "status": "Under Review",
    },
    {
        "alert_type": "Signal Issue",
        "description": "Traffic signal malfunction at major intersection.",
        "location": "Delhi-Meerut Road",
        "severity": "Medium",
        "status": "Active",
    },
]

db = SessionLocal()

try:
    admin_user = None
    for u in USERS:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if existing:
            existing.password = hash_password(u["password"])
            existing.role = u["role"]
            existing.username = u["username"]
            print(f"  Updated : {u['email']}  (role={u['role']})")
            if u["role"] == "admin" and not admin_user:
                admin_user = existing
        else:
            new_user = User(
                username=u["username"],
                email=u["email"],
                password=hash_password(u["password"]),
                role=u["role"],
            )
            db.add(new_user)
            db.flush()
            print(f"  Inserted: {u['email']}  (role={u['role']})")
            if u["role"] == "admin" and not admin_user:
                admin_user = new_user

    db.commit()

    # Seed demo alerts if no alerts exist or refresh demo alerts
    reporter_id = admin_user.id if admin_user else 1
    for alert_data in DEMO_ALERTS:
        existing_alert = db.query(Alert).filter(Alert.location == alert_data["location"]).first()
        if not existing_alert:
            new_alert = Alert(
                alert_type=alert_data["alert_type"],
                description=alert_data["description"],
                location=alert_data["location"],
                severity=alert_data["severity"],
                status=alert_data["status"],
                reported_by=reporter_id
            )
            db.add(new_alert)
            print(f"  Inserted Demo Alert: {alert_data['alert_type']} at {alert_data['location']}")
        else:
            existing_alert.alert_type = alert_data["alert_type"]
            existing_alert.description = alert_data["description"]
            existing_alert.severity = alert_data["severity"]
            existing_alert.status = alert_data["status"]

    db.commit()
    print("\n  Seed complete. All test users and demo alerts are ready.")

except Exception as e:
    db.rollback()
    print(f"\n  Error: {e}")
    raise

finally:
    db.close()

