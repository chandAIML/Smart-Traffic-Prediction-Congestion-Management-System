from fastapi import APIRouter, Depends, HTTPException
import pandas as pd

from ..dependencies import get_current_user
from .. import schemas
from ..ml_loader import ml_bundle

router = APIRouter(prefix="/prediction", tags=["Prediction"])


@router.post("/predict")
def predict(payload: schemas.PredictionIn, current_user=Depends(get_current_user)):
    if ml_bundle is None:
        raise HTTPException(
            status_code=503,
            detail="Prediction model is not loaded on the server yet."
        )

    model = ml_bundle["model"]
    city_zone_encoder = ml_bundle["city_zone_encoder"]
    road_type_encoder = ml_bundle["road_type_encoder"]
    weather_encoder = ml_bundle["weather_encoder"]
    features = ml_bundle["features"]

    try:
        row = pd.DataFrame([{
            "traffic_volume": payload.traffic_volume,
            "average_speed_kmph": payload.average_speed_kmph,
            "hour": payload.hour,
            "day_of_week": payload.day_of_week,
            "city_zone_encoded": city_zone_encoder.transform([payload.city_zone])[0],
            "road_type_encoded": road_type_encoder.transform([payload.road_type])[0],
            "weather_encoded": weather_encoder.transform([payload.weather_condition])[0],
            "accident_encoded": 1 if payload.accident_reported else 0,
        }])[features]
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Unrecognized category in input: {str(e)}"
        )

    prediction = model.predict(row)[0]
    probs = dict(zip(model.classes_, model.predict_proba(row)[0]))
    confidence = float(probs[prediction])

    return {
        "predicted_congestion": prediction,
        "confidence": confidence,
        "probabilities": {k: float(v) for k, v in probs.items()},
    }
