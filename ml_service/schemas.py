from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    job_role: str = Field(..., description="Target job role to forecast", example="Machine Learning Engineer")
    location: Optional[str] = Field("All", description="Geographic location or 'All'")
    industry: Optional[str] = Field("Technology", description="Industry domain")
    horizon_months: int = Field(6, ge=1, le=24, description="Forecast horizon in months (e.g. 3, 6, 12)")
    model_name: Optional[str] = Field("Random Forest Regressor", description="Model algorithm to use")

class MonthlyForecastPoint(BaseModel):
    month: str
    predicted_volume: int
    lower_bound: int
    upper_bound: int

class HistoricalPoint(BaseModel):
    month: str
    actual_volume: int

class PredictionResponse(BaseModel):
    success: bool = True
    job_role: str
    location: str
    industry: str
    horizon_months: int
    predicted_demand: float
    predicted_posting_volume: int
    growth_percentage: float
    historical_baseline: float
    model_name: str
    model_version: str = "1.0.0"
    confidence_interval: Dict[str, float]
    trend_direction: str
    monthly_forecast: List[MonthlyForecastPoint]
    historical_data: List[HistoricalPoint]
    disclaimer: str = (
        "Predictions are statistical estimates based on historical job-posting data "
        "and do not guarantee future employment opportunities."
    )

class ModelMetric(BaseModel):
    model_name: str
    mae: float
    mse: float
    rmse: float
    mape: float
    r2: float
    training_samples: int
    feature_count: int
    training_date: str
    description: str

class ModelPerformanceResponse(BaseModel):
    success: bool = True
    models: List[ModelMetric]
    best_model: str
    dataset_info: Dict[str, Any]

class SkillTrendItem(BaseModel):
    name: str
    category: str
    frequency: int
    growth_percentage: float
    trend_classification: str # "Emerging", "High-Demand", "Stable", "Declining"
    demand_index: float
    historical_trajectory: List[int]

