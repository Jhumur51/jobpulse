import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  DollarSign,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { jobsService } from '../../services/jobs.service';
import { careerService } from '../../services/career.service';

export const RoleComparisonPage: React.FC = () => {
  const [roleA, setRoleA] = useState('Data Scientist');
  const [roleB, setRoleB] = useState('Machine Learning Engineer');

  // Fetch available roles
  const { data: roles = [] } = useQuery({
    queryKey: ['job-roles'],
    queryFn: jobsService.getJobRoles,
  });

  // Query comparison data
  const { data: comparison, isLoading } = useQuery({
    queryKey: ['role-comparison', roleA, roleB],
    queryFn: () => careerService.compareRoles(roleA, roleB),
  });

  const handleSwapRoles = () => {
    const temp = roleA;
    setRoleA(roleB);
    setRoleB(temp);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Role Comparison Tool"
        description="Compare hiring trends, expected compensation, shared skill requirements, and growth projections between any two roles."
      />

      {/* Selectors Bar */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-semibold text-text-muted">Role A</label>
            <select
              value={roleA}
              onChange={(e) => setRoleA(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {roles.map((r) => (
                <option key={r} value={r} disabled={r === roleB}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center pt-5 sm:pt-4">
            <button
              onClick={handleSwapRoles}
              className="p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-text-muted hover:text-primary transition-colors"
              title="Swap Roles"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 space-y-1">
            <label className="text-xs font-semibold text-text-muted">Role B</label>
            <select
              value={roleB}
              onChange={(e) => setRoleB(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {roles.map((r) => (
                <option key={r} value={r} disabled={r === roleA}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Head-to-Head KPI Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role A Card */}
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Role A</span>
            <Badge variant="primary" size="sm">
              Demand Index: {comparison?.roleA.demandIndex}/100
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-navy-900 dark:text-white">
            {comparison?.roleA.name || roleA}
          </h3>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
              <span className="text-[11px] text-text-muted block">Median Base Salary</span>
              <span className="text-base font-bold font-mono text-navy-900 dark:text-white mt-1 block">
                {formatCurrency(comparison?.roleA.baseSalary || 0)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
              <span className="text-[11px] text-text-muted block">12-Mo Projected Growth</span>
              <span className="text-base font-bold text-emerald-600 mt-1 block">
                {comparison?.roleA.growthRate}
              </span>
            </div>
          </div>
        </Card>

        {/* Role B Card */}
        <Card className="p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Role B</span>
            <Badge variant="purple" size="sm">
              Demand Index: {comparison?.roleB.demandIndex}/100
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-navy-900 dark:text-white">
            {comparison?.roleB.name || roleB}
          </h3>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
              <span className="text-[11px] text-text-muted block">Median Base Salary</span>
              <span className="text-base font-bold font-mono text-navy-900 dark:text-white mt-1 block">
                {formatCurrency(comparison?.roleB.baseSalary || 0)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
              <span className="text-[11px] text-text-muted block">12-Mo Projected Growth</span>
              <span className="text-base font-bold text-emerald-600 mt-1 block">
                {comparison?.roleB.growthRate}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Historical Trend Line Comparison Chart */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-navy-900 dark:text-white mb-1">
          Hiring Volume Trajectory Comparison (12 Months)
        </h3>
        <p className="text-xs text-text-muted mb-4">
          Tracking monthly demand index over time for {roleA} vs. {roleB}
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparison?.monthlyComparison || []} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Legend />
              <Line type="monotone" dataKey={roleA} stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey={roleB} stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Skills Comparison Breakdown: Shared vs Unique */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Unique to Role A */}
        <Card className="p-5">
          <span className="text-xs font-bold text-blue-600 block mb-2">
            Specific to {roleA}
          </span>
          <p className="text-[11px] text-text-muted mb-3">
            Skills primarily expected for this discipline:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(comparison?.uniqueToA || []).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </Card>

        {/* Common Shared Skills */}
        <Card className="p-5 border-emerald-500/30">
          <span className="text-xs font-bold text-emerald-600 block mb-2">
            Shared Common Skills
          </span>
          <p className="text-[11px] text-text-muted mb-3">
            Foundational skills required by both roles:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(comparison?.commonSkills || []).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
              >
                ✓ {s}
              </span>
            ))}
          </div>
        </Card>

        {/* Unique to Role B */}
        <Card className="p-5">
          <span className="text-xs font-bold text-purple-600 block mb-2">
            Specific to {roleB}
          </span>
          <p className="text-[11px] text-text-muted mb-3">
            Skills primarily expected for this discipline:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(comparison?.uniqueToB || []).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded text-xs bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-900 font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Takeaway Advice Box */}
      {comparison?.comparisonTakeaway && (
        <Card className="p-5 bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
              Comparison Takeaway
            </h4>
            <p className="text-xs text-text-main dark:text-text-darkMain leading-relaxed">
              {comparison.comparisonTakeaway}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

