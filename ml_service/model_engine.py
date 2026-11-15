import math
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any, Optional
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge, LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

ROLES = [
    "Machine Learning Engineer",
    "Data Scientist",
    "Software Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer",
    "Cloud Solutions Architect",
    "Data Analyst",
    "Cybersecurity Analyst",
    "AI Research Scientist",
    "Mobile App Developer",
    "Product Manager",
    "Database Administrator",
    "QA Automation Engineer",
]

LOCATIONS = [
    "All",
    "Remote",
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "London, UK",
    "Toronto, Canada",
    "Berlin, Germany",
    "Dhaka, Bangladesh",
    "Bangalore, India",
]

INDUSTRIES = [
    "Technology",
    "Finance & Banking",
    "Healthcare",
    "E-commerce & Retail",
    "Education",
    "Manufacturing",
]

# Base growth trajectory multipliers per role
ROLE_PROFILES = {
    "Machine Learning Engineer": {"base": 850, "growth_rate": 0.028, "volatility": 0.08},
    "Data Scientist": {"base": 920, "growth_rate": 0.019, "volatility": 0.07},
    "AI Research Scientist": {"base": 420, "growth_rate": 0.038, "volatility": 0.09},
    "Cloud Solutions Architect": {"base": 780, "growth_rate": 0.022, "volatility": 0.06},
    "DevOps Engineer": {"base": 1100, "growth_rate": 0.021, "volatility": 0.05},
    "Cybersecurity Analyst": {"base": 710, "growth_rate": 0.025, "volatility": 0.05},
    "Full Stack Developer": {"base": 1450, "growth_rate": 0.015, "volatility": 0.06},
    "Backend Developer": {"base": 1300, "growth_rate": 0.014, "volatility": 0.05},
    "Software Engineer": {"base": 1800, "growth_rate": 0.012, "volatility": 0.05},
    "Frontend Developer": {"base": 1150, "growth_rate": 0.008, "volatility": 0.06},
    "Data Analyst": {"base": 980, "growth_rate": 0.011, "volatility": 0.05},
    "Mobile App Developer": {"base": 650, "growth_rate": 0.006, "volatility": 0.06},
    "Product Manager": {"base": 600, "growth_rate": 0.010, "volatility": 0.05},
    "Database Administrator": {"base": 480, "growth_rate": -0.004, "volatility": 0.04},
    "QA Automation Engineer": {"base": 550, "growth_rate": 0.009, "volatility": 0.05},
}

class JobMarketMLSystem:
    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.metrics: Dict[str, Dict[str, float]] = {}
        self.historical_series: Dict[str, pd.Series] = {}
        self.best_model_name: str = "Random Forest Regressor"
        self.training_date: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self._initialize_and_train()

    def _generate_synthetic_historical_data(self) -> pd.DataFrame:
        """
        Synthesizes realistic monthly aggregated job posting counts from 2021-01 to 2026-06 (66 months).
        Incorporates real macro labour-market shifts:
        - 2021 Tech hiring boom
        - 2022-2023 normalization / correction
        - 2023-2026 GenAI / Cloud acceleration
        - Seasonality (Q1 hiring spike, Q4 December dip)
        """
        np.random.seed(42)
        dates = pd.date_range(start="2021-01-01", end="2026-06-01", freq="MS")
        records = []

        for role in ROLES:
            prof = ROLE_PROFILES.get(role, {"base": 500, "growth_rate": 0.01, "volatility": 0.05})
            base = prof["base"]
            monthly_growth = prof["growth_rate"]
            vol = prof["volatility"]

            for t, dt in enumerate(dates):
                # Seasonality: higher in Jan/Feb (months 1,2) and Sep/Oct, low in Dec (month 12)
                month = dt.month
                seasonality = 1.0 + 0.08 * math.sin(2 * math.pi * (month - 1) / 12) + (0.05 if month in [1, 2, 9] else (-0.08 if month == 12 else 0))

                # Macro-economic cycle factor
                year_frac = dt.year + (dt.month - 1) / 12.0
                if year_frac < 2022.3:
                    macro = 1.0 + 0.15 * (year_frac - 2021.0) # boom
                elif year_frac < 2023.5:
                    macro = 1.18 - 0.22 * (year_frac - 2022.3) # cooling
                else:
                    # AI-related roles surge faster post-2023
                    ai_boost = 0.28 if "AI" in role or "Machine Learning" in role or "Data" in role else 0.12
                    macro = 0.92 + ai_boost * (year_frac - 2023.5)

                noise = 1.0 + np.random.normal(0, vol)
                trend = (1.0 + monthly_growth) ** t
                volume = int(max(30, base * trend * seasonality * macro * noise))

                records.append({
                    "date": dt,
                    "month_str": dt.strftime("%Y-%m"),
                    "job_role": role,
                    "posting_volume": volume,
                    "month_idx": t,
                    "month_of_year": month,
                })

        df = pd.DataFrame(records)
        return df

    def _build_feature_matrix(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray, List[str]]:
        """
        Builds lagged and rolling features for time-series supervised regression.
        """
        df = df.sort_values(by=["job_role", "date"]).reset_index(drop=True)
        
        # Add lag features
        df["lag_1"] = df.groupby("job_role")["posting_volume"].shift(1)
        df["lag_2"] = df.groupby("job_role")["posting_volume"].shift(2)
        df["lag_3"] = df.groupby("job_role")["posting_volume"].shift(3)
        df["lag_6"] = df.groupby("job_role")["posting_volume"].shift(6)
        
        # Rolling statistics
        df["rolling_mean_3"] = df.groupby("job_role")["posting_volume"].shift(1).rolling(3, min_periods=1).mean()
        df["rolling_mean_6"] = df.groupby("job_role")["posting_volume"].shift(1).rolling(6, min_periods=1).mean()
        
        # Sine/Cosine cyclical month encoding
        df["sin_month"] = np.sin(2 * np.pi * df["month_of_year"] / 12.0)
        df["cos_month"] = np.cos(2 * np.pi * df["month_of_year"] / 12.0)

        # One-hot encode roles
        role_dummies = pd.get_dummies(df["job_role"], prefix="role", drop_first=True)
        feature_df = pd.concat([
            df[["month_idx", "sin_month", "cos_month", "lag_1", "lag_2", "lag_3", "lag_6", "rolling_mean_3", "rolling_mean_6"]],
            role_dummies
        ], axis=1)

        # Drop rows where lag_6 is NaN
        valid_mask = ~feature_df["lag_6"].isna()
        X = feature_df[valid_mask].values.astype(np.float32)
        y = df.loc[valid_mask, "posting_volume"].values.astype(np.float32)
        feature_names = list(feature_df.columns)

        return X, y, feature_names

    def _initialize_and_train(self):
        """
        Trains the suite of candidate models and computes empirical evaluation metrics.
        """
        df = self._generate_synthetic_historical_data()
        self.raw_df = df

        # Cache series for fast retrieval
        for role in ROLES:
            sub = df[df["job_role"] == role].sort_values("date")
            self.historical_series[role] = sub.set_index("month_str")["posting_volume"]

        X, y, feature_names = self._build_feature_matrix(df)
        self.feature_names = feature_names

        # 80/20 train/test split (chronological)
        split_idx = int(len(X) * 0.8)
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]

        candidates = {
            "Random Forest Regressor": RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1),
            "Gradient Boosting Regressor": GradientBoostingRegressor(n_estimators=100, learning_rate=0.08, max_depth=4, random_state=42),
            "Ridge Regressor": Ridge(alpha=10.0),
            "Linear Trend Model": LinearRegression(),
        }

        descriptions = {
            "Random Forest Regressor": "Ensemble of 100 decision trees capturing non-linear interactions across lag features and cyclic seasonal curves.",
            "Gradient Boosting Regressor": "Sequential stage-wise gradient boosted trees minimizing mean squared error with shrinkage regularization.",
            "Ridge Regressor": "L2-regularized linear model preventing collinearity across autoregressive lag features.",
            "Linear Trend Model": "Ordinary least-squares linear trend baseline estimating secular baseline growth rate.",
        }

        best_score = float("inf")
        best_name = "Random Forest Regressor"

        for name, model in candidates.items():
            model.fit(X_train, y_train)
            preds = model.predict(X_test)
            preds = np.clip(preds, 0, None)

            mae = float(mean_absolute_error(y_test, preds))
            mse = float(mean_squared_error(y_test, preds))
            rmse = float(math.sqrt(mse))
            mape = float(np.mean(np.abs((y_test - preds) / np.maximum(y_test, 1))) * 100)
            r2 = float(r2_score(y_test, preds))

            self.models[name] = model
            self.metrics[name] = {
                "mae": round(mae, 2),
                "mse": round(mse, 2),
                "rmse": round(rmse, 2),
                "mape": round(mape, 2),
                "r2": round(r2, 4),
                "training_samples": len(X_train),
                "feature_count": len(feature_names),
                "training_date": self.training_date,
                "description": descriptions[name],
            }

            if rmse < best_score:
                best_score = rmse
                best_name = name

        self.best_model_name = best_name

    def predict(
        self,
        job_role: str,
        location: str = "All",
        industry: str = "Technology",
        horizon_months: int = 6,
        model_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates autoregressive monthly forecast up to horizon_months.
        """
        if job_role not in ROLES:
            # Fallback to closest match or default
            job_role = "Software Engineer"

        selected_model_name = model_name if model_name in self.models else self.best_model_name
        model = self.models[selected_model_name]

        # Retrieve recent historical window
        history_series = self.historical_series[job_role]
        recent_values = history_series.tail(12).tolist()
        recent_months = history_series.tail(12).index.tolist()

        # Location and industry scaling adjustments
        location_multiplier = 1.0
        if location in ["San Francisco, CA", "New York, NY"]:
            location_multiplier = 1.25
        elif location in ["Austin, TX", "Seattle, WA", "London, UK"]:
            location_multiplier = 1.10
        elif location in ["Dhaka, Bangladesh"]:
            location_multiplier = 0.55
        elif location == "Remote":
            location_multiplier = 1.15

        industry_multiplier = 1.0
        if industry == "Technology":
            industry_multiplier = 1.10
        elif industry == "Finance & Banking":
            industry_multiplier = 1.05
        elif industry == "Healthcare":
            industry_multiplier = 0.95

        combined_adj = location_multiplier * industry_multiplier

        # Autoregressive multi-step rollout
        sim_history = [int(v * combined_adj) for v in history_series.tolist()]
        start_date = datetime.strptime(recent_months[-1], "%Y-%m")
        
        forecast_points = []
        last_t = len(sim_history)

        for step in range(1, horizon_months + 1):
            target_dt = start_date + timedelta(days=32 * step)
            target_dt = target_dt.replace(day=1)
            target_month_str = target_dt.strftime("%Y-%m")
            month_of_year = target_dt.month

            lag_1 = sim_history[-1]
            lag_2 = sim_history[-2] if len(sim_history) >= 2 else lag_1
            lag_3 = sim_history[-3] if len(sim_history) >= 3 else lag_2
            lag_6 = sim_history[-6] if len(sim_history) >= 6 else lag_3

            rolling_3 = np.mean(sim_history[-3:])
            rolling_6 = np.mean(sim_history[-6:])

            sin_m = math.sin(2 * math.pi * month_of_year / 12.0)
            cos_m = math.cos(2 * math.pi * month_of_year / 12.0)

            # Reconstruct feature vector
            feat = [last_t + step, sin_m, cos_m, lag_1, lag_2, lag_3, lag_6, rolling_3, rolling_6]
            # Role dummy features
            for fn in self.feature_names[9:]:
                if fn == f"role_{job_role}":
                    feat.append(1.0)
                else:
                    feat.append(0.0)

            feat_arr = np.array(feat, dtype=np.float32).reshape(1, -1)
            raw_pred = float(model.predict(feat_arr)[0])
            pred_val = int(max(20, raw_pred * (location_multiplier * industry_multiplier / max(1.0, 1.0))))

            # Confidence interval based on model RMSE and time horizon dispersion
            uncertainty_growth = 1.0 + 0.05 * math.sqrt(step)
            margin = int(self.metrics[selected_model_name]["rmse"] * 0.9 * uncertainty_growth)
            lower = max(10, pred_val - margin)
            upper = pred_val + margin

            forecast_points.append({
                "month": target_month_str,
                "predicted_volume": pred_val,
                "lower_bound": lower,
                "upper_bound": upper
            })
            sim_history.append(pred_val)

        # Baseline calculation: average of last 3 historical months
        baseline = float(np.mean([v * combined_adj for v in recent_values[-3:]]))
        final_forecast_avg = float(np.mean([p["predicted_volume"] for p in forecast_points]))
        growth_pct = round(((final_forecast_avg - baseline) / max(baseline, 1.0)) * 100, 2)

        direction = "Increasing" if growth_pct > 3.0 else ("Decreasing" if growth_pct < -3.0 else "Stable")

        historical_formatted = [
            {"month": m, "actual_volume": int(v * combined_adj)}
            for m, v in zip(recent_months, recent_values)
        ]

        return {
            "success": True,
            "job_role": job_role,
            "location": location,
            "industry": industry,
            "horizon_months": horizon_months,
            "predicted_demand": round(final_forecast_avg, 1),
            "predicted_posting_volume": int(forecast_points[-1]["predicted_volume"]),
            "growth_percentage": growth_pct,
            "historical_baseline": round(baseline, 1),
            "model_name": selected_model_name,
            "model_version": "1.0.0",
            "confidence_interval": {
                "lower": float(forecast_points[-1]["lower_bound"]),
                "upper": float(forecast_points[-1]["upper_bound"]),
            },
            "trend_direction": direction,
            "monthly_forecast": forecast_points,
            "historical_data": historical_formatted,
        }

    def get_metrics_summary(self) -> Dict[str, Any]:
        models_list = []
        for name, m in self.metrics.items():
            models_list.append({
                "model_name": name,
                "mae": m["mae"],
                "mse": m["mse"],
                "rmse": m["rmse"],
                "mape": m["mape"],
                "r2": m["r2"],
                "training_samples": m["training_samples"],
                "feature_count": m["feature_count"],
                "training_date": m["training_date"],
                "description": m["description"],
            })

        return {
            "success": True,
            "models": models_list,
            "best_model": self.best_model_name,
            "dataset_info": {
                "source": "Synthesized Macro Job Market Dataset (2021-2026)",
                "total_records": len(self.raw_df),
                "roles_tracked": len(ROLES),
                "time_range": "2021-01 to 2026-06",
                "frequency": "Monthly aggregated postings",
            }
        }

