import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Compass,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Code2,
  FolderGit2,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { jobsService } from '../../services/jobs.service';
import { careerService } from '../../services/career.service';

export const CareerRoadmapPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('Machine Learning Engineer');

  // Fetch available roles
  const { data: roles = [] } = useQuery({
    queryKey: ['job-roles'],
    queryFn: jobsService.getJobRoles,
  });

  // Fetch roadmap for selected role
  const { data: roadmap, isLoading } = useQuery({
    queryKey: ['career-roadmap', selectedRole],
    queryFn: () => careerService.getRoadmap(selectedRole),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Career Learning Roadmap"
        description="Structured step-by-step learning paths, essential concepts, and portfolio project ideas for tech disciplines."
        action={
          <Badge variant="primary" size="md">
            Estimated Timeline: {roadmap?.estimatedTime || '6–9 Months'}
          </Badge>
        }
      />

      {/* Role Picker Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-semibold text-text-muted shrink-0">
            Select Track:
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedRole === r
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-text-muted hover:text-text-main hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* 3-Phase Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(roadmap?.phases || []).map((phase, idx) => (
          <Card key={idx} className="flex flex-col p-6 relative overflow-hidden border-t-4 border-t-primary">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                {phase.phase}
              </span>
              <span className="text-xs font-medium text-text-muted px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                {phase.duration}
              </span>
            </div>

            <h3 className="text-base font-bold text-navy-900 dark:text-white mb-2">
              {phase.title}
            </h3>

            <p className="text-xs text-text-muted leading-relaxed mb-4">
              {phase.description}
            </p>

            <div className="flex-1 space-y-2 mb-6">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Key Topics to Master:
              </h4>
              <ul className="space-y-1.5">
                {phase.topics.map((t, i) => (
                  <li key={i} className="text-xs text-text-main dark:text-text-darkMain flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border-light dark:border-border-dark">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                Tools & Frameworks:
              </h4>
              <div className="flex flex-wrap gap-1">
                {phase.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-text-muted"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Projects and Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Portfolio Project Ideas */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FolderGit2 className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-navy-900 dark:text-white">
              Portfolio Project Ideas
            </h3>
          </div>
          <p className="text-xs text-text-muted mb-4">
            Concrete projects you can build and showcase to stand out in interviews:
          </p>

          <div className="space-y-4">
            {(roadmap?.projectIdeas || []).map((proj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-navy-900 dark:text-white">
                    {proj.title}
                  </span>
                  <Badge variant={proj.level === 'Beginner' ? 'neutral' : 'primary'} size="sm">
                    {proj.level}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Free Resources & Documentation */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-navy-900 dark:text-white">
              Recommended Free Learning Resources
            </h3>
          </div>
          <p className="text-xs text-text-muted mb-4">
            High-quality documentation, interactive courses, and books:
          </p>

          <div className="space-y-3">
            {(roadmap?.freeResources || []).map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark flex items-center justify-between hover:border-primary transition-colors group"
              >
                <span className="text-xs font-semibold text-text-main dark:text-text-darkMain group-hover:text-primary">
                  {res.name}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary shrink-0" />
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

