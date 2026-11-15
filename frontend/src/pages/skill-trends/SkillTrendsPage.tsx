import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Search,
  Filter,
  Download,
  RotateCcw,
  Eye,
  X,
  Layers,
  BarChart2,
  Calendar,
} from 'lucide-react';
import { skillsService } from '../../services/skills.service';
import { SkillItem } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { PageHeader } from '../../components/common/PageHeader';
import { downloadCsv } from '../../utils/export';

const CATEGORIES = [
  'All',
  'AI and Machine Learning',
  'Cloud and DevOps',
  'Programming',
  'Web Development',
  'Data and Analytics',
  'Cybersecurity',
  'Business and Soft Skills',
];

const TREND_TABS = ['All', 'Emerging', 'High-Demand', 'Stable', 'Declining'];

export const SkillTrendsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTrend, setSelectedTrend] = useState('All');
  const [search, setSearch] = useState('');
  const [inspectedSkill, setInspectedSkill] = useState<SkillItem | null>(null);

  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills-intelligence', selectedCategory, selectedTrend, search],
    queryFn: () =>
      skillsService.getSkills({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        trend: selectedTrend !== 'All' ? selectedTrend : undefined,
        search: search.trim() ? search.trim() : undefined,
      }),
  });

  const getTrendBadge = (trend: string, growth: number) => {
    switch (trend) {
      case 'Emerging':
        return (
          <Badge variant="success" size="sm" className="gap-1 font-bold">
            <TrendingUp className="w-3 h-3" /> +{growth}% Emerging
          </Badge>
        );
      case 'High-Demand':
        return (
          <Badge variant="primary" size="sm" className="gap-1 font-bold">
            <Sparkles className="w-3 h-3" /> High Volume (+{growth}%)
          </Badge>
        );
      case 'Declining':
        return (
          <Badge variant="danger" size="sm" className="gap-1 font-bold">
            <TrendingDown className="w-3 h-3" /> {growth}% Declining
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm" className="gap-1">
            <Minus className="w-3 h-3" /> Stable ({growth >= 0 ? `+${growth}` : growth}%)
          </Badge>
        );
    }
  };

  const isFiltered =
    Boolean(search.trim()) || selectedCategory !== 'All' || selectedTrend !== 'All';

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedTrend('All');
    setSearch('');
  };

  const handleExportSkills = () => {
    if (!skills || skills.length === 0) return;
    const headers = [
      'Skill Name',
      'Category',
      'Total Frequency',
      'YoY Growth (%)',
      'Trend Classification',
      'Demand Index',
      'Trajectory (12M)',
    ];
    const rows = skills.map((s) => [
      s.name,
      s.category,
      s.frequency,
      s.growth_percentage,
      s.trend_classification,
      s.demand_index,
      (s.historical_trajectory || []).join('; '),
    ]);
    downloadCsv('jobpulse_skills_intelligence_report', headers, rows);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="In-Demand Skills & Trends"
        description="Explore the most in-demand programming languages, frameworks, and tech tools."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportSkills}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export Skills (CSV)
            </Button>
          </div>
        }
      />

      {/* Category Pills & Search */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Trend Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {TREND_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTrend(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedTrend === tab
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-text-muted hover:text-text-main hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search specific skill..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-text-muted shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Domain:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900'
                    : 'text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs text-primary"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-48">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-1/2 mb-6" />
              <Skeleton className="h-16 w-full" />
            </Card>
          ))
        ) : (skills || []).length === 0 ? (
          <div className="col-span-full py-16 text-center text-text-muted">
            No skills found matching the selected filters.
          </div>
        ) : (
          (skills || []).map((skill, idx) => (
            <Card
              key={idx}
              hover
              onClick={() => setInspectedSkill(skill)}
              className="flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base text-navy-900 dark:text-white group-hover:text-primary transition-colors">
                    {skill.name}
                  </h3>
                  {getTrendBadge(skill.trend_classification, skill.growth_percentage)}
                </div>

                <Badge variant="neutral" size="sm" className="mb-4">
                  {skill.category}
                </Badge>

                {/* Trajectory visualization spark-bars */}
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[11px] text-text-muted dark:text-text-darkMuted">
                    <span>12-Month Demand Curve</span>
                    <span className="font-mono font-semibold">Index: {skill.demand_index}</span>
                  </div>
                  <div className="flex items-end gap-1 h-10 pt-2">
                    {skill.historical_trajectory?.map((val: number, i: number) => {
                      const maxVal = Math.max(...skill.historical_trajectory, 1);
                      const heightPct = Math.max(12, Math.round((val / maxVal) * 100));
                      return (
                        <div
                          key={i}
                          title={`Month ${i + 1}: ${val}`}
                          className={`flex-1 rounded-xs transition-all duration-300 ${
                            skill.trend_classification === 'Emerging'
                              ? 'bg-emerald-500 hover:bg-emerald-600'
                              : skill.trend_classification === 'Declining'
                              ? 'bg-red-400 hover:bg-red-500'
                              : 'bg-primary hover:bg-primary-700'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-border-light dark:border-border-dark flex items-center justify-between text-xs">
                <span className="text-text-muted dark:text-text-darkMuted">Total Postings:</span>
                <span className="font-mono font-bold text-navy-900 dark:text-white">
                  {skill.frequency.toLocaleString()}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detailed Skill Inspection Modal */}
      {inspectedSkill && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card-dark rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border-light dark:border-border-dark space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-border-light dark:border-border-dark">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xl text-navy-900 dark:text-white">
                    {inspectedSkill.name}
                  </h3>
                  {getTrendBadge(inspectedSkill.trend_classification, inspectedSkill.growth_percentage)}
                </div>
                <p className="text-xs text-text-muted mt-1">Domain: {inspectedSkill.category}</p>
              </div>
              <button
                onClick={() => setInspectedSkill(null)}
                className="p-1 rounded-lg text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-[11px] text-text-muted block">Database Postings</span>
                <span className="text-base font-extrabold font-mono text-navy-900 dark:text-white mt-0.5 block">
                  {inspectedSkill.frequency.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-[11px] text-text-muted block">Relative Demand Index</span>
                <span className="text-base font-extrabold font-mono text-primary mt-0.5 block">
                  {inspectedSkill.demand_index} / 100
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-[11px] text-text-muted block">YoY Growth</span>
                <span
                  className={`text-base font-extrabold font-mono mt-0.5 block ${
                    inspectedSkill.growth_percentage >= 0 ? 'text-emerald-600' : 'text-danger'
                  }`}
                >
                  {inspectedSkill.growth_percentage >= 0 ? '+' : ''}
                  {inspectedSkill.growth_percentage}%
                </span>
              </div>
            </div>

            {/* Monthly Trend Points */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Month-by-Month Trajectory Index
              </h4>
              <div className="grid grid-cols-6 gap-1.5 text-center text-[10px]">
                {inspectedSkill.historical_trajectory?.map((val, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark"
                  >
                    <span className="text-text-muted block">M{mIdx + 1}</span>
                    <span className="font-mono font-bold text-navy-900 dark:text-white mt-0.5 block">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border-light dark:border-border-dark flex justify-end">
              <Button size="sm" onClick={() => setInspectedSkill(null)}>
                Close Intelligence Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
