from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional

# =====================================================================
# USER MANAGEMENT SCHEMAS
# =====================================================================

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str  # "admin", "operator", "commuter"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =====================================================================
# TRAFFIC MONITORING SCHEMAS
# =====================================================================

class TrafficDataIn(BaseModel):
    road_name: str
    vehicle_count: int
    average_speed: float
    weather: Optional[str] = "Clear"
    accident: Optional[bool] = False


class TrafficDataOut(BaseModel):
    id: int
    road_name: str
    vehicle_count: int
    average_speed: float
    congestion_level: str  # e.g., "Low", "Medium", "High"
    weather: str
    accident: bool
    recorded_at: datetime

    #Modern Pydantic v2 Configuration
    model_config = ConfigDict(from_attributes=True)


# =====================================================================
# TRAFFIC & AI PREDICTION SCHEMAS
# =====================================================================

class PredictionIn(BaseModel):
    traffic_volume: int
    average_speed_kmph: float
    hour: int
    day_of_week: int
    city_zone: str
    road_type: str
    weather_condition: str
    accident_reported: bool


#response validation schema for AI Prediction Output
class PredictionOut(BaseModel):
    predicted_congestion_level: str
    estimated_delay_minutes: int
    confidence_score: float
    generated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# =====================================================================
# MANUAL ALERT SCHEMAS
# =====================================================================

class AlertCreate(BaseModel):
    alert_type: str
    description: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    severity: str = "Medium"


class AlertResponse(BaseModel):
    id: int
    alert_type: str
    description: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    severity: str
    status: str
    reported_by: int
    created_at: datetime
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)