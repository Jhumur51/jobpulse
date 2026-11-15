import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Compass,
  Cpu,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  MapPin,
  Building,
  CheckCircle2,
  RefreshCw,
  Download,
  RotateCcw,
  FileJson,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { predictionService } from '../../services/prediction.service';
import { modelsService } from '../../services/models.service';
import { jobsService } from '../../services/jobs.service';
import { PredictionResponse } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { PageHeader } from '../../components/common/PageHeader';
import { downloadCsv, downloadJson } from '../../utils/export';

export const PredictionsPage: React.FC = () => {
  // Form state
  const [jobRole, setJobRole] = useState('Machine Learning Engineer');
  const [location, setLocation] = useState('All');
  const [industry, setIndustry] = useState('Technology');
  const [horizon, setHorizon] = useState<number>(6);
  const [modelName, setModelName] = useState('Gradient Boosting Regressor');

  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  // Fetch available roles & filters
  const { data: roles } = useQuery({
    queryKey: ['prediction-roles'],
    queryFn: jobsService.getJobRoles,
  });

  const { data: filters } = useQuery({
    queryKey: ['prediction-filters'],
    queryFn: jobsService.getJobFilters,
  });

  const { data: modelsData } = useQuery({
    queryKey: ['prediction-models'],
    queryFn: modelsService.getModels,
  });

  // Mutation to call Express -> FastAPI
  const mutation = useMutation({
    mutationFn: predictionService.createPrediction,
    onSuccess: (data) => {
      setPredictionResult(data);
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      jobRole,
      location,
      industry,
      horizon,
      modelName,
    });
  };

  const handleReset = () => {
    setPredictionResult(null);
    setJobRole('Machine Learning Engineer');
    setLocation('All');
    setIndustry('Technology');
    setHorizon(6);
  };

  const handleApplyPreset = (role: string, h: number, mod: string) => {
    setJobRole(role);
    setHorizon(h);
    setModelName(mod);
    mutation.mutate({
      jobRole: role,
      location,
      industry,
      horizon: h,
      modelName: mod,
    });
  };

  const handleExportCsv = () => {
    if (!predictionResult) return;
    const headers = ['Month', 'Series Type', 'Volume', 'Lower Bound', 'Upper Bound', 'Model'];
    const rows: (string | number)[][] = [];

    (predictionResult.historical_data || []).forEach((h) => {
      rows.push([h.month, 'Historical Observed', h.actual_volume, h.actual_volume, h.actual_volume, predictionResult.model_name]);
    });

    (predictionResult.monthly_forecast || []).forEach((f) => {
      rows.push([f.month, 'Predicted Forecast', f.predicted_volume, f.lower_bound, f.upper_bound, predictionResult.model_name]);
    });

    const safeRole = predictionResult.job_role.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadCsv(`jobpulse_forecast_${safeRole}_${predictionResult.horizon_months}m`, headers, rows);
  };

  const handleExportJson = () => {
    if (!predictionResult) return;
    const safeRole = predictionResult.job_role.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadJson(`jobpulse_forecast_${safeRole}_${predictionResult.horizon_months}m`, predictionResult);
  };

  // Combine historical and forecast data for the chart
  const combinedChartData = React.useMemo(() => {
    if (!predictionResult) return [];

    const hist = (predictionResult.historical_data || []).map((h) => ({
      month: h.month,
      actual: h.actual_volume,
      forecast: null,
      lower: null,
      upper: null,
    }));

    // Bridge the last historical point with the forecast
    if (hist.length > 0 && predictionResult.monthly_forecast?.length > 0) {
      hist[hist.length - 1].forecast = hist[hist.length - 1].actual;
      hist[hist.length - 1].lower = hist[hist.length - 1].actual;
      hist[hist.length - 1].upper = hist[hist.length - 1].actual;
    }

    const fore = (predictionResult.monthly_forecast || []).map((f) => ({
      month: f.month,
      actual: null,
      forecast: f.predicted_volume,
      lower: f.lower_bound,
      upper: f.upper_bound,
    }));

    return [...hist, ...fore];
  }, [predictionResult]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Demand Prediction"
        description="Forecast future hiring demand for tech roles using machine learning models."
        action={
          predictionResult && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Export Forecast (CSV)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportJson}
                leftIcon={<FileJson className="w-4 h-4" />}
              >
                JSON
              </Button>
            </div>
          )
        }
      />

      {/* Preset Quick Starters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-text-muted">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Fast Scenario Benchmarks:
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() =>
                handleApplyPreset(
                  'Machine Learning Engineer',
                  6,
                  'Gradient Boosting Regressor'
                )
              }
              className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-primary border border-blue-200 dark:border-blue-800 text-[11px] font-semibold hover:bg-blue-100 transition-colors"
            >
              ML Engineer (6-Mo Gradient Boost)
            </button>
            <button
              onClick={() =>
                handleApplyPreset(
                  'Data Scientist',
                  12,
                  'Random Forest Regressor'
                )
              }
              className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-600 border border-purple-200 dark:border-purple-800 text-[11px] font-semibold hover:bg-purple-100 transition-colors"
            >
              Data Scientist (12-Mo Random Forest)
            </button>
            <button
              onClick={() =>
                handleApplyPreset(
                  'Cloud Solutions Architect',
                  6,
                  'Ridge Regressor'
                )
              }
              className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-600 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold hover:bg-amber-100 transition-colors"
            >
              Cloud Architect (6-Mo Ridge)
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Prediction Input Form */}
        <Card className="lg:col-span-1 h-fit">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900 dark:text-white">
                  Forecast Configuration
                </h3>
                <p className="text-xs text-text-muted dark:text-text-darkMuted">
                  Select target role and model parameters
                </p>
              </div>
            </div>
            {predictionResult && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset Form"
                className="p-1 rounded-md text-text-muted hover:text-text-main"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Job Role */}
            <div>
              <label className="block text-xs font-semibold text-text-main dark:text-text-darkMain mb-1.5">
                Target Job Role
              </label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {(roles || [
                  'Machine Learning Engineer',
                  'Data Scientist',
                  'Software Engineer',
                  'Full Stack Developer',
                  'DevOps Engineer',
                  'Cloud Solutions Architect',
                  'Cybersecurity Analyst',
                ]).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-text-main dark:text-text-darkMain mb-1.5">
                Geographic Market
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="All">Global Market (All Regions)</option>
                {filters?.locations?.filter((l) => l !== 'All').map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-semibold text-text-main dark:text-text-darkMain mb-1.5">
                Industry Domain (Optional)
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Technology">Technology & Software</option>
                <option value="Finance & Banking">Finance & Banking</option>
                <option value="Healthcare">Healthcare & BioTech</option>
                <option value="E-commerce & Retail">E-commerce & Retail</option>
                <option value="Education">Education & Academic</option>
              </select>
            </div>

            {/* Prediction Horizon */}
            <div>
              <label className="block text-xs font-semibold text-text-main dark:text-text-darkMain mb-1.5">
                Prediction Horizon
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setHorizon(m)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      horizon === m
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'border-border-light dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-text-muted'
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selector */}
            <div>
              <label className="block text-xs font-semibold text-text-main dark:text-text-darkMain mb-1.5">
                Inference Model
              </label>
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              >
                <option value="Gradient Boosting Regressor">
                  Gradient Boosting (Best: 0.9867 R²)
                </option>
                <option value="Random Forest Regressor">
                  Random Forest Regressor (0.9841 R²)
                </option>
                <option value="Ridge Regressor">
                  Ridge L2 Regressor (0.9665 R²)
                </option>
                <option value="Linear Trend Model">
                  Linear Trend Baseline (0.9548 R²)
                </option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="md"
              isLoading={mutation.isPending}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate Prediction
            </Button>
          </form>

          {/* Model Note */}
          <div className="mt-6 p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 flex items-start gap-2.5 text-[11px] text-blue-800 dark:text-blue-300">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
            <span>
              Predictions pass through Express gateway to the isolated FastAPI ML pipeline.
            </span>
          </div>
        </Card>

        {/* Prediction Results & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {mutation.isError && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-start gap-3 text-sm text-red-700 dark:text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Prediction Failed</p>
                <p className="text-xs mt-0.5">{mutation.error?.message}</p>
              </div>
            </div>
          )}

          {!predictionResult && !mutation.isPending && !mutation.isError && (
            <Card className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 dark:text-white">
                No Prediction Generated Yet
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted max-w-sm mt-1 mb-6">
                Select your target job title and forecast horizon on the left, then click{' '}
                <span className="font-semibold text-primary">Generate Prediction</span>.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  mutation.mutate({
                    jobRole,
                    location,
                    industry,
                    horizon,
                    modelName,
                  })
                }
              >
                Run Default ML Forecast
              </Button>
            </Card>
          )}

          {predictionResult && (
            <>
              {/* Prediction Summary KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4">
                  <span className="text-[11px] font-semibold uppercase text-text-muted dark:text-text-darkMuted">
                    Target Volume
                  </span>
                  <div className="text-xl font-extrabold text-navy-900 dark:text-white mt-1">
                    {predictionResult.predicted_posting_volume.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-text-muted mt-0.5 block">
                    Month {predictionResult.horizon_months} Postings
                  </span>
                </Card>

                <Card className="p-4">
                  <span className="text-[11px] font-semibold uppercase text-text-muted dark:text-text-darkMuted">
                    Projected Growth
                  </span>
                  <div
                    className={`text-xl font-extrabold mt-1 flex items-center gap-1 ${
                      predictionResult.growth_percentage >= 0 ? 'text-emerald-600' : 'text-danger'
                    }`}
                  >
                    {predictionResult.growth_percentage >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {predictionResult.growth_percentage}%
                  </div>
                  <span className="text-[10px] text-text-muted mt-0.5 block">
                    {predictionResult.trend_direction} Trend
                  </span>
                </Card>

                <Card className="p-4">
                  <span className="text-[11px] font-semibold uppercase text-text-muted dark:text-text-darkMuted">
                    Confidence Bounds
                  </span>
                  <div className="text-xs font-mono font-bold text-navy-900 dark:text-white mt-1.5">
                    {predictionResult.confidence_interval.lower.toLocaleString()} –{' '}
                    {predictionResult.confidence_interval.upper.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-text-muted mt-0.5 block">
                    ± Model RMSE interval
                  </span>
                </Card>

                <Card className="p-4">
                  <span className="text-[11px] font-semibold uppercase text-text-muted dark:text-text-darkMuted">
                    Active ML Model
                  </span>
                  <div className="text-xs font-semibold text-primary mt-1.5 truncate">
                    {predictionResult.model_name}
                  </div>
                  <span className="text-[10px] text-text-muted mt-0.5 block">
                    v{predictionResult.model_version} Production
                  </span>
                </Card>
              </div>

              {/* Chart: Historical Baseline vs. ML Forecast */}
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-navy-900 dark:text-white">
                      Historical Demand vs. {predictionResult.horizon_months}-Month ML Forecast
                    </h3>
                    <p className="text-xs text-text-muted dark:text-text-darkMuted mt-0.5">
                      {predictionResult.job_role} • {predictionResult.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">
                      Horizon: {predictionResult.horizon_months} Months
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportCsv}
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                    >
                      Export
                    </Button>
                  </div>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={combinedChartData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          borderColor: '#1E293B',
                          color: '#FFF',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                      
                      {/* Confidence bounds area */}
                      <Area
                        type="monotone"
                        dataKey="upper"
                        stroke="none"
                        fill="#BFDBFE"
                        fillOpacity={0.35}
                        name="Confidence Bound (Upper)"
                      />
                      <Area
                        type="monotone"
                        dataKey="lower"
                        stroke="none"
                        fill="#FFFFFF"
                        fillOpacity={0.0}
                        name="Confidence Bound (Lower)"
                      />

                      {/* Actual Historical Line */}
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#64748B"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Historical Observed"
                      />

                      {/* Forecast Line */}
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#2563EB"
                        strokeWidth={3}
                        strokeDasharray="4 4"
                        dot={{ r: 4 }}
                        name="Predicted Demand"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Mandatory Disclaimer */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <span className="font-bold">Model Disclaimer:</span> {predictionResult.disclaimer}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
