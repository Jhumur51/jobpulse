import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Gauge,
  Award,
  Layers,
  Calendar,
  CheckCircle2,
  Database,
  BarChart2,
  Info,
  RefreshCw,
  Download,
  Eye,
  X,
  Cpu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { modelsService } from '../../services/models.service';
import { ModelMetric } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { PageHeader } from '../../components/common/PageHeader';
import { downloadCsv } from '../../utils/export';

export const ModelPerformancePage: React.FC = () => {
  const [refreshToast, setRefreshToast] = useState(false);
  const [inspectedModel, setInspectedModel] = useState<ModelMetric | null>(null);

  const {
    data: performanceData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['models-performance'],
    queryFn: modelsService.getPerformance,
  });

  const models = performanceData?.models || [];
  const bestModelName = performanceData?.best_model || 'Gradient Boosting Regressor';
  const bestModel = models.find((m) => m.model_name === bestModelName) || models[0];

  const handleRefresh = async () => {
    await refetch();
    setRefreshToast(true);
    setTimeout(() => setRefreshToast(false), 3000);
  };

  const handleExportCsv = () => {
    if (!models || models.length === 0) return;
    const headers = ['Algorithm Name', 'MAE', 'MSE', 'RMSE', 'MAPE (%)', 'R2 Score', 'Status'];
    const rows = models.map((m) => [
      m.model_name,
      m.mae,
      m.mse,
      m.rmse,
      m.mape,
      m.r2,
      m.model_name === bestModelName ? 'Best Performing' : 'Candidate',
    ]);
    downloadCsv('jobpulse_model_benchmark_matrix', headers, rows);
  };

  const comparisonChartData = models.map((m) => ({
    name: m.model_name.replace(' Regressor', '').replace(' Model', ''),
    RMSE: m.rmse,
    MAE: m.mae,
    MAPE: m.mape,
    R2_Percentage: Math.round(m.r2 * 100),
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Model Evaluation & Metrics"
        description="Compare accuracy, error rates, and evaluation metrics for trained regression models."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              isLoading={isFetching}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />}
            >
              Refresh Benchmarks
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Metrics (CSV)
            </Button>
          </div>
        }
      />

      {refreshToast && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Latest evaluation benchmarks successfully synchronized from ML engine.</span>
        </div>
      )}

      {/* Best Model Showcase Banner */}
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <Card className="bg-gradient-to-r from-navy-900 to-navy-950 text-white border-navy-800 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                  <Award className="w-3.5 h-3.5 mr-1" /> Best Performing Model
                </Badge>
                <span className="text-xs font-mono text-slate-400">
                  Evaluated: {bestModel?.training_date}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {bestModel?.model_name}
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {bestModel?.description}
              </p>
            </div>

            <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-navy-800 pt-4 md:pt-0 md:pl-8">
              <div>
                <span className="text-xs font-mono text-slate-400">R² Coefficient</span>
                <div className="text-3xl font-extrabold text-emerald-400">
                  {bestModel?.r2}
                </div>
                <span className="text-[11px] text-slate-400">98.67% Explained Variance</span>
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400">Mean Abs. Error</span>
                <div className="text-3xl font-extrabold text-blue-400">
                  {bestModel?.mae}
                </div>
                <span className="text-[11px] text-slate-400">Monthly Postings</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Error Metric Comparison Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-navy-900 dark:text-white">
              Model Error Metrics Comparison (RMSE & MAE)
            </h3>
            <p className="text-xs text-text-muted dark:text-text-darkMuted mt-0.5">
              Lower error indicates higher forecasting fidelity on held-out validation periods
            </p>
          </div>
          <Badge variant="primary">Benchmark Suite</Badge>
        </div>

        <div className="h-72 w-full">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
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
                <Bar dataKey="RMSE" fill="#2563EB" name="Root Mean Squared Error (RMSE)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="MAE" fill="#10B981" name="Mean Absolute Error (MAE)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Full Metric Breakdown Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-navy-900 dark:text-white">
              Model Evaluation Matrix
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Click any algorithm to inspect training parameters and feature architectures
            </p>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Held-out Out-of-Time Validation Splits
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-border-light dark:border-border-dark text-text-muted dark:text-text-darkMuted uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Algorithm Name</th>
                <th className="py-3 px-4 font-mono">MAE</th>
                <th className="py-3 px-4 font-mono">MSE</th>
                <th className="py-3 px-4 font-mono">RMSE</th>
                <th className="py-3 px-4 font-mono">MAPE (%)</th>
                <th className="py-3 px-4 font-mono">R² Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark font-mono">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : (
                models.map((m, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setInspectedModel(m)}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-sans font-semibold text-text-main dark:text-text-darkMain">
                      {m.model_name}
                    </td>
                    <td className="py-3 px-4">{m.mae}</td>
                    <td className="py-3 px-4">{m.mse}</td>
                    <td className="py-3 px-4 text-primary font-bold">{m.rmse}</td>
                    <td className="py-3 px-4">{m.mape}%</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">{m.r2}</td>
                    <td className="py-3 px-4 font-sans">
                      {m.model_name === bestModelName ? (
                        <Badge variant="success" size="sm">
                          Best Model
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          Candidate
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedModel(m);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dataset & Training Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border-light dark:border-border-dark">
            <Database className="w-4 h-4 text-primary" />
            <h4 className="font-bold text-sm text-navy-900 dark:text-white">
              Dataset Corpus Specification
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-border-light dark:border-border-dark">
              <span className="text-text-muted">Corpus Source:</span>
              <span className="font-semibold text-text-main dark:text-text-darkMain">
                {performanceData?.dataset_info?.source || 'Macro Job Market Dataset'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-light dark:border-border-dark">
              <span className="text-text-muted">Total Processed Records:</span>
              <span className="font-mono font-semibold text-text-main dark:text-text-darkMain">
                {performanceData?.dataset_info?.total_records || '720'} Monthly Batches
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-light dark:border-border-dark">
              <span className="text-text-muted">Time-Series Range:</span>
              <span className="font-semibold text-text-main dark:text-text-darkMain">
                {performanceData?.dataset_info?.time_range || '2021-01 to 2026-06'}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border-light dark:border-border-dark">
            <Layers className="w-4 h-4 text-purple-600" />
            <h4 className="font-bold text-sm text-navy-900 dark:text-white">
              Feature Vector Engineering
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-border-light dark:border-border-dark">
              <span className="text-text-muted">Feature Dimension:</span>
              <span className="font-mono font-semibold text-text-main dark:text-text-darkMain">
                23 Features
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-light dark:border-border-dark">
              <span className="text-text-muted">Lag Architecture:</span>
              <span className="font-semibold text-text-main dark:text-text-darkMain">
                Lag-1, Lag-2, Lag-3, Lag-6 + Rolling Means
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-light dark:border-border-dark">
              <span className="text-text-muted">Cyclical Seasonality:</span>
              <span className="font-semibold text-text-main dark:text-text-darkMain">
                Sinusoidal Month Trigonometric Encoding
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Model Inspection Modal */}
      {inspectedModel && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card-dark rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border-light dark:border-border-dark space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-border-light dark:border-border-dark">
              <div>
                <h3 className="font-bold text-lg text-navy-900 dark:text-white">
                  {inspectedModel.model_name}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Evaluated on {inspectedModel.training_date}
                </p>
              </div>
              <button
                onClick={() => setInspectedModel(null)}
                className="p-1 rounded-lg text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              {inspectedModel.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <span className="text-text-muted block">R² Explained Variance</span>
                <span className="font-mono font-bold text-base text-emerald-600 block mt-1">
                  {inspectedModel.r2} ({Math.round(inspectedModel.r2 * 100)}%)
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <span className="text-text-muted block">Root Mean Squared Error</span>
                <span className="font-mono font-bold text-base text-primary block mt-1">
                  {inspectedModel.rmse} postings
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <span className="text-text-muted block">Mean Absolute Error</span>
                <span className="font-mono font-bold text-base text-navy-900 dark:text-white block mt-1">
                  {inspectedModel.mae} postings
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <span className="text-text-muted block">Mean Abs. Percentage Error</span>
                <span className="font-mono font-bold text-base text-navy-900 dark:text-white block mt-1">
                  {inspectedModel.mape}%
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border-light dark:border-border-dark flex justify-end">
              <Button size="sm" onClick={() => setInspectedModel(null)}>
                Close Model Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
