import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  TrendingUp,
  MapPin,
  Briefcase,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { jobsService } from '../../services/jobs.service';
import { careerService } from '../../services/career.service';
import { SalaryEstimateResult } from '../../types';

export const SalaryEstimatorPage: React.FC = () => {
  const [role, setRole] = useState('Machine Learning Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level (3-5 yrs)');
  const [location, setLocation] = useState('Remote');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['PyTorch / Deep Learning', 'AWS / Cloud Architecture']);
  const [estimateResult, setEstimateResult] = useState<SalaryEstimateResult | null>(null);

  // Fetch roles and filters
  const { data: roles = [] } = useQuery({
    queryKey: ['job-roles'],
    queryFn: jobsService.getJobRoles,
  });

  const { data: filters } = useQuery({
    queryKey: ['job-filters'],
    queryFn: jobsService.getJobFilters,
  });

  const mutation = useMutation({
    mutationFn: careerService.estimateSalary,
    onSuccess: (data) => {
      setEstimateResult(data);
    },
  });

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    mutation.mutate({
      role,
      experienceLevel,
      location,
      skills: selectedSkills,
    });
  };

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
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
        title="Salary Estimator"
        description="Estimate expected compensation ranges for tech roles based on experience level, location, and key skills."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRole('Machine Learning Engineer');
              setExperienceLevel('Mid-Level (3-5 yrs)');
              setLocation('Remote');
              setSelectedSkills([]);
              setEstimateResult(null);
            }}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Card */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-bold text-navy-900 dark:text-white mb-4">
              Compensation Parameters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {(filters?.experienceLevels || [
                    'Entry-Level (0-2 yrs)',
                    'Mid-Level (3-5 yrs)',
                    'Senior (6-8 yrs)',
                    'Lead / Principal (9+ yrs)',
                  ])
                    .filter((l) => l !== 'All')
                    .map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {(filters?.locations || [
                    'Remote',
                    'San Francisco, CA',
                    'New York, NY',
                    'Seattle, WA',
                    'Austin, TX',
                    'London, UK',
                    'Toronto, Canada',
                    'Dhaka, Bangladesh',
                    'Bangalore, India',
                  ]).map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">
                  Add High-Paying Skills (+bonus)
                </label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    'PyTorch / Deep Learning',
                    'Kubernetes & Docker',
                    'AWS / Cloud Architecture',
                    'Large Language Models (LLMs)',
                    'Terraform & Infrastructure as Code',
                    'System Design & Microservices',
                  ].map((s) => {
                    const isSelected = selectedSkills.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleToggleSkill(s)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-text-muted hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-border-light dark:border-border-dark">
                <Button
                  onClick={handleCalculate}
                  isLoading={mutation.isPending}
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Estimate Salary
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Output Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {estimateResult ? (
            <>
              {/* Main Salary Card */}
              <Card className="p-6 bg-gradient-to-br from-white to-emerald-50/40 dark:from-card-dark dark:to-emerald-950/20 border-2 border-emerald-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-light dark:border-border-dark">
                  <div>
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Estimated Market Compensation
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy-900 dark:text-white mt-0.5">
                      {estimateResult.role}
                    </h2>
                    <p className="text-xs text-text-muted mt-1">
                      {estimateResult.experienceLevel} • {estimateResult.location}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCurrency(estimateResult.estimatedMedian)}
                    </div>
                    <span className="text-xs text-text-muted">Estimated Median / Year</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark">
                    <span className="text-[11px] text-text-muted font-semibold uppercase block">Lower Bound</span>
                    <span className="text-lg font-bold font-mono text-navy-900 dark:text-white mt-1 block">
                      {formatCurrency(estimateResult.estimatedMin)}
                    </span>
                    <span className="text-[10px] text-text-muted">25th percentile range</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark">
                    <span className="text-[11px] text-text-muted font-semibold uppercase block">Upper Bound</span>
                    <span className="text-lg font-bold font-mono text-navy-900 dark:text-white mt-1 block">
                      {formatCurrency(estimateResult.estimatedMax)}
                    </span>
                    <span className="text-[10px] text-text-muted">75th percentile range</span>
                  </div>
                </div>

                {estimateResult.appliedSkillBonus > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                    <span>
                      High-paying skill premium included:{' '}
                      <strong className="font-mono">+{formatCurrency(estimateResult.appliedSkillBonus)}</strong>
                    </span>
                    <Badge variant="success" size="sm">Bonus Active</Badge>
                  </div>
                )}
              </Card>

              {/* Experience Career Progression Chart */}
              <Card className="p-6">
                <h4 className="font-bold text-sm text-navy-900 dark:text-white mb-2">
                  Salary Growth Across Experience Tiers
                </h4>
                <p className="text-xs text-text-muted mb-4">
                  Expected annual median progression for this role:
                </p>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={estimateResult.experienceProgression} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="level" tick={{ fontSize: 11 }} />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) => `$${v / 1000}k`}
                      />
                      <Tooltip
                        formatter={(val: any) => [formatCurrency(Number(val)), 'Median Base']}
                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Bar dataKey="salary" fill="#10B981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center border-dashed">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-navy-900 dark:text-white">
                Calculate Market Compensation
              </h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto mt-2 leading-relaxed">
                Select your job role, experience level, and location on the left, then click{' '}
                <span className="font-semibold text-text-main dark:text-text-darkMain">"Estimate Salary"</span> to view compensation ranges and growth curves.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

