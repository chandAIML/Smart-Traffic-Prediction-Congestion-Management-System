from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..dependencies import get_db, get_current_user
from .. import models

router = APIRouter(prefix="/routes", tags=["Routes"])

CONGESTION_SCORE = {"Low": 1, "Medium": 2, "High": 3}

ROAD_DISTANCE_KM = {
    "NH-24": 22.0,
    "Outer Ring Road": 28.5,
    "Ring Road": 18.0,
    "MG Road": 12.5,
}

# origin/destination pairs the commuter UI actually offers
# (Favorite Routes + AI Route Recommendation + Quick Destinations),
# each mapped to the real road(s) whose live congestion data decides
# which option is fastest.
ROUTE_OPTIONS = {
    ("Home", "College"): ["MG Road", "Ring Road"],
    ("College", "Bus Stand"): ["MG Road"],
    ("Home", "Bus Stand"): ["Ring Road", "MG Road"],
    ("Home", "Airport"): ["NH-24", "Outer Ring Road"],
    ("MKCE", "Karur Bus Stand"): ["Ring Road", "MG Road"],
    ("Connaught Place", "Noida"): ["NH-24", "Outer Ring Road"],
    ("Connaught Place", "Gurgaon"): ["Ring Road", "MG Road"],
}


@router.get("/options")
def list_route_options(current_user=Depends(get_current_user)):
    """All origin/destination pairs the commuter UI can offer in its
    dropdowns, so the frontend never has to hardcode a list that can
    drift out of sync with the backend."""
    places = set()
    for origin, destination in ROUTE_OPTIONS.keys():
        places.add(origin)
        places.add(destination)
    return {
        "places": sorted(places),
        "pairs": [{"origin": o, "destination": d} for (o, d) in ROUTE_OPTIONS.keys()],
    }


@router.get("/recommend")
def recommend_route(origin: str, destination: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    candidates = ROUTE_OPTIONS.get((origin, destination))
    if not candidates:
        raise HTTPException(status_code=404, detail="No known route between these points yet.")

    results = []
    for road in candidates:
        latest = (
            db.query(models.TrafficData)
            .filter(models.TrafficData.road_name == road)
            .order_by(models.TrafficData.id.desc())
            .first()
        )
        congestion = latest.congestion_level if latest else "Medium"
        avg_speed = latest.average_speed if latest else 30.0  
        distance_km = ROAD_DISTANCE_KM.get(road, 15.0)  
        
        safe_speed = max(avg_speed, 5.0)
        travel_time_minutes = round((distance_km / safe_speed) * 60, 1)

        results.append({
            "road_name": road,
            "congestion_level": congestion,
            "score": CONGESTION_SCORE.get(congestion, 2),
            "distance_km": distance_km,
            "average_speed": avg_speed,
            "estimated_travel_time_minutes": travel_time_minutes,
        })

    results.sort(key=lambda r: r["score"])
    for i, r in enumerate(results):
        r["recommended"] = (i == 0)

    return {"origin": origin, "destination": destination, "routes": results}
