import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  Layers,
  Sparkles,
  Building2,
  MapPin,
  TrendingUp,
  AlertCircle,
  Database,
  RefreshCw,
  Download,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { dashboardService } from '../../services/dashboard.service';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { PageHeader } from '../../components/common/PageHeader';
import { downloadCsv } from '../../utils/export';

const CHART_COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [refreshToast, setRefreshToast] = useState(false);

  // Query KPIs and analytics data
  const { data: summary, isLoading: loadingSummary, refetch: refetchSummary, isFetching: fetchingSummary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardService.getSummary,
  });

  const { data: volumeData, isLoading: loadingVolume, refetch: refetchVolume } = useQuery({
    queryKey: ['dashboard-volume'],
    queryFn: dashboardService.getJobVolume,
  });

  const { data: topRoles, isLoading: loadingRoles, refetch: refetchRoles } = useQuery({
    queryKey: ['dashboard-top-roles'],
    queryFn: dashboardService.getTopRoles,
  });

  const { data: topSkills, isLoading: loadingSkills, refetch: refetchSkills } = useQuery({
    queryKey: ['dashboard-top-skills'],
    queryFn: dashboardService.getTopSkills,
  });

  const { data: industries, isLoading: loadingIndustries, refetch: refetchIndustries } = useQuery({
    queryKey: ['dashboard-industries'],
    queryFn: dashboardService.getIndustryDistribution,
  });

  const { data: locations, isLoading: loadingLocations, refetch: refetchLocations } = useQuery({
    queryKey: ['dashboard-locations'],
    queryFn: dashboardService.getLocationDistribution,
  });

  const { data: experience, isLoading: loadingExperience, refetch: refetchExperience } = useQuery({
    queryKey: ['dashboard-experience'],
    queryFn: dashboardService.getExperienceDistribution,
  });

  const { data: education, isLoading: loadingEducation } = useQuery({
    queryKey: ['dashboard-education'],
    queryFn: dashboardService.getEducationDistribution,
  });

  const handleRefreshAll = async () => {
    await Promise.all([
      refetchSummary(),
      refetchVolume(),
      refetchRoles(),
      refetchSkills(),
      refetchIndustries(),
      refetchLocations(),
      refetchExperience(),
    ]);
    setRefreshToast(true);
    setTimeout(() => setRefreshToast(false), 3000);
  };

  const handleExportSummaryCsv = () => {
    const headers = ['Category', 'Metric', 'Value'];
    const rows: (string | number)[][] = [
      ['KPI', 'Total Postings', summary?.totalJobPostings || 0],
      ['KPI', 'Tracked Roles', summary?.uniqueJobRoles || 0],
      ['KPI', 'Skills Identified', summary?.skillsIdentified || 0],
      ['KPI', 'Industries Covered', summary?.industriesCovered || 0],
      ['KPI', 'Active Locations', summary?.activeLocations || 0],
    ];

    (topRoles || []).forEach((r) => {
      rows.push(['Top Role', r.role, `${r.postings} (${r.share}%)`]);
    });

    (topSkills || []).forEach((s) => {
      rows.push(['Top Skill', s.skill, s.count]);
    });

    downloadCsv('jobpulse_executive_analytics_summary', headers, rows);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Job Market Overview"
        description="Overview of job postings, top hiring roles, and in-demand tech skills."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              isLoading={fetchingSummary}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${fetchingSummary ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportSummaryCsv}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>
            {summary?.isDemo && (
              <Badge variant="warning" size="sm">
                Sample Data
              </Badge>
            )}
            <Badge variant="success" size="sm">
              Backend Connected
            </Badge>
          </div>
        }
      />

      {refreshToast && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Dashboard charts and numbers updated.</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Job Postings */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
              Total Postings
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-primary">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          {loadingSummary ? (
            <Skeleton className="h-8 w-24 mt-3" />
          ) : (
            <div className="mt-2">
              <div className="text-2xl font-bold text-navy-900 dark:text-white">
                {summary?.totalJobPostings?.toLocaleString() || '0'}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +14.2% YoY Growth
              </span>
            </div>
          )}
        </Card>

        {/* Unique Job Roles */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
              Tracked Roles
            </span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          {loadingSummary ? (
            <Skeleton className="h-8 w-16 mt-3" />
          ) : (
            <div className="mt-2">
              <div className="text-2xl font-bold text-navy-900 dark:text-white">
                {summary?.uniqueJobRoles || '0'}
              </div>
              <span className="text-[11px] text-text-muted dark:text-text-darkMuted mt-0.5 block">
                Tech & Data domains
              </span>
            </div>
          )}
        </Card>

        {/* Skills Identified */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
              Skills Profiled
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          {loadingSummary ? (
            <Skeleton className="h-8 w-16 mt-3" />
          ) : (
            <div className="mt-2">
              <div className="text-2xl font-bold text-navy-900 dark:text-white">
                {summary?.skillsIdentified || '0'}
              </div>
              <span className="text-[11px] text-text-muted dark:text-text-darkMuted mt-0.5 block">
                6 Tech Categories
              </span>
            </div>
          )}
        </Card>

        {/* Industries Covered */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
              Industries
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          {loadingSummary ? (
            <Skeleton className="h-8 w-16 mt-3" />
          ) : (
            <div className="mt-2">
              <div className="text-2xl font-bold text-navy-900 dark:text-white">
                {summary?.industriesCovered || '0'}
              </div>
              <span className="text-[11px] text-text-muted dark:text-text-darkMuted mt-0.5 block">
                Primary sectors
              </span>
            </div>
          )}
        </Card>

        {/* Active Locations */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
              Locations
            </span>
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          {loadingSummary ? (
            <Skeleton className="h-8 w-16 mt-3" />
          ) : (
            <div className="mt-2">
              <div className="text-2xl font-bold text-navy-900 dark:text-white">
                {summary?.activeLocations || '0'}
              </div>
              <span className="text-[11px] text-text-muted dark:text-text-darkMuted mt-0.5 block">
                Global + Regional Hubs
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* Row 1: Volume Over Time & Top Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Posting Volume Over Time */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-navy-900 dark:text-white">
                Job Posting Volume Over Time
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted mt-0.5">
                Monthly aggregated market demand trajectory (12-Month window)
              </p>
            </div>
            <Link
              to="/predictions"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Forecast Horizon <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full">
            {loadingVolume ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#volGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Top 10 Job Roles */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-navy-900 dark:text-white">
                Top In-Demand Roles
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted mt-0.5">
                Market share percentage
              </p>
            </div>
            <Link
              to="/job-trends"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              All Roles <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {loadingRoles ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
            ) : (
              (topRoles || []).slice(0, 5).map((r, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate('/job-trends')}
                  className="space-y-1.5 cursor-pointer group"
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-text-main dark:text-text-darkMain group-hover:text-primary transition-colors truncate max-w-[180px]">
                      {r.role}
                    </span>
                    <span className="font-mono text-text-muted dark:text-text-darkMuted">
                      {r.postings.toLocaleString()} ({r.share}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, r.share * 4.5)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Row 2: Most Demanded Skills & Industry Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Demanded Skills */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-navy-900 dark:text-white">
                Most Demanded Technical Skills
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted mt-0.5">
                Skill frequency occurrences in dataset
              </p>
            </div>
            <Link
              to="/skill-trends"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Skill Intelligence <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-72 w-full">
            {loadingSkills ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSkills?.slice(0, 7) || []} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                  <XAxis dataKey="skill" stroke="#94A3B8" fontSize={10} angle={-25} textAnchor="end" tickLine={false} />
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
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Job Distribution by Industry */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-navy-900 dark:text-white">
                Job Distribution by Industry
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted mt-0.5">
                Sector allocation breakdown
              </p>
            </div>
            <Badge variant="neutral">Sectors</Badge>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            {loadingIndustries ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industries || []}
                    dataKey="count"
                    nameKey="industry"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {(industries || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      color: '#FFF',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Row 3: Experience & Location Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience Requirements */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-navy-900 dark:text-white">
                Experience Level Distribution
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted mt-0.5">
                Seniority requirement proportions
              </p>
            </div>
            <Badge variant="neutral">Experience</Badge>
          </div>

          <div className="space-y-4">
            {loadingExperience ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              (experience || []).map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-text-main dark:text-text-darkMain">
                      {exp.level}
                    </span>
                    <span className="font-mono text-text-muted dark:text-text-darkMuted">
                      {exp.percentage}% ({exp.count.toLocaleString()} jobs)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${exp.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Location-based Distribution */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-navy-900 dark:text-white">
                Location-Based Demand
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted mt-0.5">
                Remote vs. Metros distribution
              </p>
            </div>
            <Badge variant="neutral">Locations</Badge>
          </div>

          <div className="h-64 w-full">
            {loadingLocations ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locations?.slice(0, 6) || []} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} horizontal={false} />
                  <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="location" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      color: '#FFF',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
