from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from . import ml_loader  
from .routers import auth, traffic, prediction, routes,reports, analytics
from app.routers import alerts

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TrafficVision AI API",
    description="Smart Traffic Prediction & Congestion Management Platform Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(traffic.router)
app.include_router(prediction.router)
app.include_router(routes.router)
app.include_router(reports.router)
app.include_router(alerts.router)
app.include_router(analytics.router)

@app.get("/", tags=["Root"])
def home():
    """Application Health Check Endpoint."""
    return {"message": "TrafficVision AI System API is running smoothly."}
