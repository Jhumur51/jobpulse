import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  ListFilter,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { jobsService } from '../../services/jobs.service';
import { careerService } from '../../services/career.service';
import { SkillGapResult } from '../../types';

// Preset popular skills for quick clicking
const POPULAR_SKILLS = [
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'SQL',
  'Docker',
  'Git',
  'PyTorch',
  'AWS',
  'Kubernetes',
  'FastAPI',
  'PostgreSQL',
  'Tailwind CSS',
  'Pandas',
  'Scikit-learn',
  'Linux',
  'Next.js',
  'REST APIs',
  'Terraform',
];

export const SkillGapPage: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Machine Learning Engineer');
  const [inputMode, setInputMode] = useState<'chips' | 'text'>('chips');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'SQL', 'Git', 'Pandas']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<SkillGapResult | null>(null);

  // Fetch available roles
  const { data: roles = [] } = useQuery({
    queryKey: ['job-roles'],
    queryFn: jobsService.getJobRoles,
  });

  const mutation = useMutation({
    mutationFn: careerService.analyzeSkillGap,
    onSuccess: (data) => {
      setAnalysisResult(data);
    },
  });

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleRunAnalysis = () => {
    mutation.mutate({
      targetRole,
      userSkills: inputMode === 'chips' ? selectedSkills : [],
      resumeText: inputMode === 'text' ? resumeText : '',
    });
  };

  const handleReset = () => {
    setSelectedSkills(['Python', 'SQL']);
    setResumeText('');
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Skill Gap Analyzer"
        description="Select your known skills or paste your resume text to compare against required skills for any tech role."
        action={
          <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Configuration Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-bold text-navy-900 dark:text-white mb-4">
              1. Select Target Job Role
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted">Target Career Track</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-navy-900 dark:text-white">
                  2. Input Your Skills
                </h3>
                <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-xs">
                  <button
                    onClick={() => setInputMode('chips')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                      inputMode === 'chips'
                        ? 'bg-white dark:bg-card-dark text-primary shadow-xs'
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    Skill Tags
                  </button>
                  <button
                    onClick={() => setInputMode('text')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                      inputMode === 'text'
                        ? 'bg-white dark:bg-card-dark text-primary shadow-xs'
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    Paste Resume
                  </button>
                </div>
              </div>

              {inputMode === 'chips' ? (
                <div className="space-y-4">
                  <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      placeholder="Add another skill (e.g. PyTorch)..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button type="submit" size="sm" variant="secondary">
                      Add
                    </Button>
                  </form>

                  <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto p-1">
                    {POPULAR_SKILLS.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleSkill(skill)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-primary text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-text-muted hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {skill}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-text-muted">
                    Selected skills ({selectedSkills.length}):{' '}
                    <span className="font-semibold text-text-main dark:text-text-darkMain">
                      {selectedSkills.join(', ') || 'None selected'}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-text-muted">
                    Paste text from your CV, LinkedIn skills, or summary:
                  </p>
                  <textarea
                    rows={7}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="e.g. Experienced software developer with 3 years in Python, SQL, REST APIs, Git, Docker, and training basic machine learning models..."
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark">
              <Button
                onClick={handleRunAnalysis}
                isLoading={mutation.isPending}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full"
              >
                Analyze Skill Gap
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {analysisResult ? (
            <>
              {/* Score Banner Card */}
              <Card className="p-6 bg-gradient-to-br from-white to-blue-50/40 dark:from-card-dark dark:to-blue-950/20 border-2 border-primary/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-light dark:border-border-dark">
                  <div>
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Role Match Result
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy-900 dark:text-white mt-0.5">
                      {analysisResult.targetRole}
                    </h2>
                    <p className="text-xs text-text-muted mt-1">
                      Estimated 12-mo market growth: <span className="font-semibold text-emerald-600">{analysisResult.roleEstimatedGrowth}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-primary font-mono">
                        {analysisResult.matchPercentage}%
                      </div>
                      <Badge variant={analysisResult.statusBadge} size="sm">
                        {analysisResult.statusLabel}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.matchPercentage}%` }}
                    />
                  </div>
                </div>
              </Card>

              {/* Matched vs Missing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matched Skills Card */}
                <Card className="p-5 border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-sm text-navy-900 dark:text-white">
                      Matched Skills ({analysisResult.matchedSkills.length})
                    </h4>
                  </div>
                  <p className="text-xs text-text-muted mb-3">
                    Skills you already have that are required for this role:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.matchedSkills.length > 0 ? (
                      analysisResult.matchedSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-text-muted italic">No direct matches found yet.</span>
                    )}
                  </div>
                </Card>

                {/* Missing Core Skills Card */}
                <Card className="p-5 border-amber-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-sm text-navy-900 dark:text-white">
                      Missing Core Skills ({analysisResult.missingCoreSkills.length})
                    </h4>
                  </div>
                  <p className="text-xs text-text-muted mb-3">
                    High-demand skills employers look for in this role:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.missingCoreSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Actionable Learning Next Steps */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h4 className="font-bold text-base text-navy-900 dark:text-white">
                    Recommended Learning Actions
                  </h4>
                </div>
                <div className="space-y-3">
                  {analysisResult.topRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-xs text-text-main dark:text-text-darkMain leading-relaxed">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center border-dashed">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-navy-900 dark:text-white">
                Ready for Analysis
              </h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto mt-2 leading-relaxed">
                Choose a job role on the left, pick the skills you know (or paste your resume), and click{' '}
                <span className="font-semibold text-text-main dark:text-text-darkMain">"Analyze Skill Gap"</span> to calculate your match score.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

