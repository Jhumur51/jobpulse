import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any

from schemas import (
    PredictionRequest,
    PredictionResponse,
    ModelPerformanceResponse,
    SkillTrendItem
)
from model_engine import (
    JobMarketMLSystem,
    ROLES,
    LOCATIONS,
    INDUSTRIES
)
from skill_engine import get_skills_intelligence

app = FastAPI(
    title="JOBPULSE — Machine Learning Prediction & Skill Intelligence Service",
    description="Python ML Service providing job market demand forecasting and skill trend analytics",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML system
ml_system = JobMarketMLSystem()

@app.get("/")
def root():
    return {
        "service": "JobPulse Machine Learning Intelligence Service",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "models_loaded": list(ml_system.models.keys()),
        "best_model": ml_system.best_model_name,
        "training_date": ml_system.training_date,
        "total_historical_records": len(ml_system.raw_df)
    }

@app.get("/roles", response_model=List[str])
def list_roles():
    return ROLES

@app.get("/locations", response_model=List[str])
def list_locations():
    return LOCATIONS

@app.get("/industries", response_model=List[str])
def list_industries():
    return INDUSTRIES

@app.get("/models")
def list_models():
    models_info = []
    for name, metric in ml_system.metrics.items():
        models_info.append({
            "name": name,
            "description": metric["description"],
            "mae": metric["mae"],
            "rmse": metric["rmse"],
            "r2": metric["r2"],
            "is_best": name == ml_system.best_model_name
        })
    return {
        "success": True,
        "models": models_info,
        "best_model": ml_system.best_model_name
    }

@app.get("/model-performance", response_model=ModelPerformanceResponse)
def get_model_performance():
    return ml_system.get_metrics_summary()

@app.get("/model-performance/best")
def get_best_model():
    best_name = ml_system.best_model_name
    return {
        "success": True,
        "best_model": best_name,
        "metrics": ml_system.metrics[best_name]
    }

@app.post("/predict", response_model=PredictionResponse)
def generate_prediction(req: PredictionRequest):
    try:
        result = ml_system.predict(
            job_role=req.job_role,
            location=req.location or "All",
            industry=req.industry or "Technology",
            horizon_months=req.horizon_months,
            model_name=req.model_name
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/skill-trends")
def get_skill_trends(
    category: Optional[str] = Query(None, description="Category filter"),
    trend: Optional[str] = Query(None, description="Trend classification filter"),
    search: Optional[str] = Query(None, description="Search keyword")
):
    items = get_skills_intelligence(category=category, trend=trend, search=search)
    return {
        "success": True,
        "count": len(items),
        "data": items
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)

