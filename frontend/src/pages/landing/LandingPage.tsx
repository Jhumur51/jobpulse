import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  BrainCircuit,
  Compass,
  Gauge,
  ArrowRight,
  CheckCircle2,
  Database,
  BarChart3,
  Layers,
  Sparkles,
  Shield,
  FileText,
  Cpu,
  Zap,
  TrendingDown,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const LandingPage: React.FC = () => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<'forecast' | 'skills' | 'roles' | 'data'>('forecast');

  // Handle URL hash on load
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-border-light dark:border-border-dark">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-xs font-medium text-primary mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Machine Learning & Data Analytics Project</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-navy-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Job Market Trends &{' '}
            <span className="text-primary">
              Demand Prediction
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-text-muted dark:text-text-darkMuted max-w-2xl mx-auto leading-relaxed">
            A simple tool to explore hiring trends, see in-demand skills, and predict future job demand using machine learning.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Dashboard
              </Button>
            </Link>
            <Link to="/predictions">
              <Button size="lg" variant="outline" leftIcon={<Compass className="w-4 h-4" />}>
                Try Predictions
              </Button>
            </Link>
          </div>

          {/* Key Quick Stats */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">
                350,000+
              </div>
              <div className="text-xs text-text-muted dark:text-text-darkMuted mt-1">
                Job Postings Analyzed
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                15 Roles
              </div>
              <div className="text-xs text-text-muted dark:text-text-darkMuted mt-1">
                Tech Roles Tracked
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                98.6%
              </div>
              <div className="text-xs text-text-muted dark:text-text-darkMuted mt-1">
                Best Model Accuracy (R²)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">
                3–12 Mo
              </div>
              <div className="text-xs text-text-muted dark:text-text-darkMuted mt-1">
                Forecast Range
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Core Features Section (id="features") */}
      <section id="features" className="py-16 bg-bg-light dark:bg-bg-dark border-b border-border-light dark:border-border-dark scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="primary" className="mb-2">
              Features
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
              What You Can Do
            </h2>
            <p className="mt-3 text-text-muted dark:text-text-darkMuted text-sm">
              Click on the tabs below to explore the main modules of this project.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 max-w-3xl mx-auto">
            <button
              onClick={() => setActiveFeatureTab('forecast')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeFeatureTab === 'forecast'
                  ? 'bg-primary text-white shadow-md shadow-primary/25 scale-102'
                  : 'bg-white dark:bg-card-dark text-text-muted hover:text-text-main border border-border-light dark:border-border-dark'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Demand Forecast</span>
            </button>

            <button
              onClick={() => setActiveFeatureTab('skills')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeFeatureTab === 'skills'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 scale-102'
                  : 'bg-white dark:bg-card-dark text-text-muted hover:text-text-main border border-border-light dark:border-border-dark'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Skill Trends</span>
            </button>

            <button
              onClick={() => setActiveFeatureTab('roles')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeFeatureTab === 'roles'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-102'
                  : 'bg-white dark:bg-card-dark text-text-muted hover:text-text-main border border-border-light dark:border-border-dark'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Job Roles</span>
            </button>

            <button
              onClick={() => setActiveFeatureTab('data')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeFeatureTab === 'data'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-102'
                  : 'bg-white dark:bg-card-dark text-text-muted hover:text-text-main border border-border-light dark:border-border-dark'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Dataset Hub</span>
            </button>
          </div>

          {/* Interactive Feature Display Showcase */}
          <div className="mt-6 max-w-4xl mx-auto">
            {activeFeatureTab === 'forecast' && (
              <Card className="p-6 sm:p-8 border-2 border-primary/30 shadow-lg bg-white dark:bg-card-dark">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-light dark:border-border-dark">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="primary">Machine Learning Model</Badge>
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        Gradient Boosting (98.6% R²)
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 dark:text-white">
                      Job Demand Prediction
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      Predict hiring demand for 3, 6, or 12 months for different tech roles.
                    </p>
                  </div>
                  <Link to="/predictions">
                    <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Open Forecast
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <span className="text-[11px] text-text-muted uppercase font-semibold block">Sample Role</span>
                    <span className="font-bold text-sm text-navy-900 dark:text-white mt-1 block">Machine Learning Engineer</span>
                    <span className="text-[10px] text-text-muted">Tech Sector</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <span className="text-[11px] text-text-muted uppercase font-semibold block">6-Month Prediction</span>
                    <span className="font-bold text-base font-mono text-primary mt-1 block">~4,820 Postings</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">+18.4% Expected Growth</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <span className="text-[11px] text-text-muted uppercase font-semibold block">Expected Range</span>
                    <span className="font-bold text-sm font-mono text-navy-900 dark:text-white mt-1 block">4,685 — 4,955</span>
                    <span className="text-[10px] text-text-muted">Confidence Bounds</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs">
                  <span className="text-blue-900 dark:text-blue-200">
                    Compares Gradient Boosting, Random Forest, Ridge, and Linear Regression models.
                  </span>
                  <Link to="/predictions" className="text-primary font-bold hover:underline shrink-0 ml-4">
                    Try Live Prediction &rarr;
                  </Link>
                </div>
              </Card>
            )}

            {activeFeatureTab === 'skills' && (
              <Card className="p-6 sm:p-8 border-2 border-purple-500/30 shadow-lg bg-white dark:bg-card-dark">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-light dark:border-border-dark">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="purple">Skill Analysis</Badge>
                      <span className="text-xs font-mono text-purple-600 font-semibold">Trend Tracking</span>
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 dark:text-white">
                      In-Demand Tech Skills
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      Check which skills are emerging, stable, or declining in job postings.
                    </p>
                  </div>
                  <Link to="/skill-trends">
                    <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Explore Skills
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                  <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900">
                    <Badge variant="success" size="sm" className="mb-2">Growing Fast</Badge>
                    <span className="font-bold text-sm text-navy-900 dark:text-white block">LLMs & Prompting</span>
                    <span className="text-[11px] text-text-muted mt-1 block">High growth rate in recent postings</span>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                    <Badge variant="primary" size="sm" className="mb-2">High Demand</Badge>
                    <span className="font-bold text-sm text-navy-900 dark:text-white block">PyTorch & Transformers</span>
                    <span className="text-[11px] text-text-muted mt-1 block">Frequently required in AI roles</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark">
                    <Badge variant="neutral" size="sm" className="mb-2">Core Foundation</Badge>
                    <span className="font-bold text-sm text-navy-900 dark:text-white block">Python & SQL</span>
                    <span className="text-[11px] text-text-muted mt-1 block">Present in most technical postings</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 flex items-center justify-between text-xs">
                  <span className="text-purple-900 dark:text-purple-200">
                    Tracks 250+ skills across programming, databases, cloud, and AI.
                  </span>
                  <Link to="/skill-trends" className="text-purple-600 font-bold hover:underline shrink-0 ml-4">
                    View All Skills &rarr;
                  </Link>
                </div>
              </Card>
            )}

            {activeFeatureTab === 'roles' && (
              <Card className="p-6 sm:p-8 border-2 border-emerald-500/30 shadow-lg bg-white dark:bg-card-dark">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-light dark:border-border-dark">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="success">Job Demand</Badge>
                      <span className="text-xs font-mono text-emerald-600 font-semibold">15 Roles</span>
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 dark:text-white">
                      Job Trends by Role
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      Compare job numbers and trends across popular technology roles.
                    </p>
                  </div>
                  <Link to="/job-trends">
                    <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                      View Roles
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3 my-6">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-text-main dark:text-text-darkMain">Software Engineer</span>
                      <span className="font-mono text-text-muted">~34% of tech postings</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[34%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-text-main dark:text-text-darkMain">Machine Learning Engineer</span>
                      <span className="font-mono text-text-muted">~22% of tech postings</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-[22%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-text-main dark:text-text-darkMain">Data Scientist</span>
                      <span className="font-mono text-text-muted">~18% of tech postings</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full w-[18%]" />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-xs">
                  <span className="text-emerald-900 dark:text-emerald-200">
                    Filter by location, experience, and industry with CSV export options.
                  </span>
                  <Link to="/job-trends" className="text-emerald-700 font-bold hover:underline shrink-0 ml-4">
                    Explore Role Trends &rarr;
                  </Link>
                </div>
              </Card>
            )}

            {activeFeatureTab === 'data' && (
              <Card className="p-6 sm:p-8 border-2 border-amber-500/30 shadow-lg bg-white dark:bg-card-dark">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-light dark:border-border-dark">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="warning">Data</Badge>
                      <span className="text-xs font-mono text-amber-600 font-semibold">CSV Upload</span>
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 dark:text-white">
                      Dataset Management
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      Manage and upload CSV datasets used to train models and display charts.
                    </p>
                  </div>
                  <Link to="/datasets">
                    <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Manage Data
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <span className="text-[11px] text-text-muted uppercase font-semibold block">Total Dataset</span>
                    <span className="font-bold text-base font-mono text-navy-900 dark:text-white mt-1 block">350,000+ Records</span>
                    <span className="text-[10px] text-text-muted">Monthly Aggregates</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <span className="text-[11px] text-text-muted uppercase font-semibold block">Features</span>
                    <span className="font-bold text-base font-mono text-amber-600 mt-1 block">Lags & Moving Averages</span>
                    <span className="text-[10px] text-text-muted">Past 1, 2, 3, 6 Months</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <span className="text-[11px] text-text-muted uppercase font-semibold block">Data Cleaning</span>
                    <span className="font-bold text-sm text-emerald-600 mt-1 block">Duplicates Removed</span>
                    <span className="text-[10px] text-text-muted">Standardized Schema</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-center justify-between text-xs">
                  <span className="text-amber-900 dark:text-amber-200">
                    Upload new job posting CSV files to inspect and explore custom data.
                  </span>
                  <Link to="/datasets" className="text-amber-700 font-bold hover:underline shrink-0 ml-4">
                    Open Datasets Page &rarr;
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Career Planning & Student Tools Section (id="career-tools") */}
      <section id="career-tools" className="py-16 bg-slate-50 dark:bg-slate-900/40 border-b border-border-light dark:border-border-dark scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="success" className="mb-2">
              Career & Student Tools
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
              Plan Your Tech Career
            </h2>
            <p className="mt-3 text-text-muted dark:text-text-darkMuted text-sm">
              Use data-driven tools to test your skills, calculate expected salary, compare roles, and follow step-by-step learning paths.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tool 1 */}
            <Card hover className="p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-primary flex items-center justify-center mb-4">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-navy-900 dark:text-white mb-1.5">
                  Skill Gap Analyzer
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Select your skills or paste your resume text to calculate your match score and see missing skills.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark">
                <Link to="/skill-gap" className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline">
                  Analyze Skills <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>

            {/* Tool 2 */}
            <Card hover className="p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-navy-900 dark:text-white mb-1.5">
                  Salary Estimator
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Estimate compensation ranges based on experience tier, location, and high-paying skill premiums.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark">
                <Link to="/salary-estimator" className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1 hover:underline">
                  Estimate Salary <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>

            {/* Tool 3 */}
            <Card hover className="p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-navy-900 dark:text-white mb-1.5">
                  Career Roadmap
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Structured 3-phase curriculum with key concepts, tools, and hands-on portfolio project ideas.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark">
                <Link to="/career-roadmap" className="text-xs font-semibold text-purple-600 inline-flex items-center gap-1 hover:underline">
                  View Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>

            {/* Tool 4 */}
            <Card hover className="p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-navy-900 dark:text-white mb-1.5">
                  Role Comparison
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Compare any two tech roles side-by-side on hiring volume, expected growth, and skill overlap.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark">
                <Link to="/role-comparison" className="text-xs font-semibold text-amber-600 inline-flex items-center gap-1 hover:underline">
                  Compare Roles <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Analytics Preview Section */}
      <section id="analytics" className="py-16 bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="primary" className="mb-2">
              Analytics
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
              Job Market Overview
            </h2>
            <p className="mt-3 text-text-muted dark:text-text-darkMuted text-sm">
              Quick summaries of hiring numbers, popular roles, and growing skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover className="flex flex-col p-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-primary flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2">
                Hiring Trends by Role
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted leading-relaxed flex-1">
                See how job openings change over time for roles like software engineering, data science, and cloud.
              </p>
              <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark">
                <Link
                  to="/job-trends"
                  className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
                >
                  View Job Trends <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>

            <Card hover className="flex flex-col p-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center mb-4">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2">
                In-Demand Skills
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted leading-relaxed flex-1">
                Discover which programming languages, frameworks, and AI tools are being mentioned most in job posts.
              </p>
              <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark">
                <Link
                  to="/skill-trends"
                  className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
                >
                  View Skills List <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>

            <Card hover className="flex flex-col p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2">
                Future Demand Estimates
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted leading-relaxed flex-1">
                Forecast job openings for the next 3, 6, or 12 months using trained regression models.
              </p>
              <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark">
                <Link
                  to="/predictions"
                  className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
                >
                  Make a Prediction <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Model Performance & Methodology */}
      <section id="ml-models" className="py-16 bg-bg-light dark:bg-bg-dark border-b border-border-light dark:border-border-dark scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="purple" className="mb-2">
                Machine Learning
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
                Trained on Real Historical Data
              </h2>
              <p className="mt-3 text-text-muted dark:text-text-darkMuted text-sm leading-relaxed">
                We compare multiple standard regression algorithms to identify the best model for predicting job demand.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-text-main dark:text-text-darkMain">
                      Model Comparison
                    </h4>
                    <p className="text-[11px] text-text-muted dark:text-text-darkMuted mt-0.5">
                      Evaluates Random Forest, Gradient Boosting, Ridge, and Linear Regression.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-text-main dark:text-text-darkMain">
                      Standard Metrics (MAE, RMSE, R²)
                    </h4>
                    <p className="text-[11px] text-text-muted dark:text-text-darkMuted mt-0.5">
                      Clear accuracy and error measurements tested on holdout data.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-text-main dark:text-text-darkMain">
                      Prediction Range
                    </h4>
                    <p className="text-[11px] text-text-muted dark:text-text-darkMuted mt-0.5">
                      Shows expected upper and lower bounds for forecast estimates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/model-performance">
                  <Button variant="outline" size="sm" rightIcon={<Gauge className="w-4 h-4" />}>
                    View Model Benchmarks
                  </Button>
                </Link>
              </div>
            </div>

            {/* Model Metric Highlight Card */}
            <Card className="bg-white dark:bg-navy-900 text-text-main dark:text-white border-border-light dark:border-navy-800 shadow-md dark:shadow-lg p-6">
              <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-navy-800">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-xs tracking-wide text-navy-900 dark:text-white">
                    Model Evaluation Summary
                  </span>
                </div>
                <Badge variant="success" size="sm">Trained</Badge>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-border-light dark:border-navy-800/60">
                  <span className="text-text-muted dark:text-slate-400 font-sans text-xs">Top Model</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Gradient Boosting Regressor</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border-light dark:border-navy-800/60">
                  <span className="text-text-muted dark:text-slate-400 font-sans text-xs">R² Accuracy</span>
                  <span className="font-bold text-navy-900 dark:text-white">0.9867 (98.6%)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border-light dark:border-navy-800/60">
                  <span className="text-text-muted dark:text-slate-400 font-sans text-xs">RMSE Error</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">135.5 Postings</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border-light dark:border-navy-800/60">
                  <span className="text-text-muted dark:text-slate-400 font-sans text-xs">MAPE</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">5.75%</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-text-muted dark:text-slate-400 font-sans text-xs">Historical Timeframe</span>
                  <span className="font-bold text-navy-900 dark:text-white">2021 – 2026</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-16 bg-white dark:bg-card-dark scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-2 text-text-muted dark:text-text-darkMuted text-xs sm:text-sm">
              A 3-step pipeline from raw job posts to visual forecasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-light dark:border-border-dark">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold text-base mb-3">
                1
              </div>
              <h3 className="font-bold text-sm mb-1.5 text-navy-900 dark:text-white">
                Data Collection & Cleaning
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted leading-relaxed">
                Raw job listings are collected, cleaned to remove duplicates, and tagged with standardized skills and roles.
              </p>
            </div>

            <div className="text-center p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-light dark:border-border-dark">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold text-base mb-3">
                2
              </div>
              <h3 className="font-bold text-sm mb-1.5 text-navy-900 dark:text-white">
                Feature Creation & Training
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted leading-relaxed">
                We calculate historical lags and moving averages, then train regression models using Scikit-Learn.
              </p>
            </div>

            <div className="text-center p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-light dark:border-border-dark">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold text-base mb-3">
                3
              </div>
              <h3 className="font-bold text-sm mb-1.5 text-navy-900 dark:text-white">
                Forecasting & Charts
              </h3>
              <p className="text-xs text-text-muted dark:text-text-darkMuted leading-relaxed">
                Users can select any role to view interactive prediction charts with expected confidence intervals.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-14 p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-100 dark:from-navy-900 dark:via-slate-900 dark:to-navy-950 text-center relative overflow-hidden border border-blue-200/80 dark:border-navy-800 shadow-lg dark:shadow-xl">
            <div className="relative z-10 max-w-xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-navy-900 dark:text-white tracking-tight">
                Ready to Explore the Data?
              </h3>
              <p className="text-text-muted dark:text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed max-w-md mx-auto">
                Explore interactive charts, test prediction horizons, and view model results.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/dashboard">
                  <Button
                    size="md"
                    variant="primary"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="shadow-md shadow-primary/30 font-semibold px-6"
                  >
                    View Dashboard
                  </Button>
                </Link>
                <Link to="/predictions">
                  <Button
                    size="md"
                    variant="outline"
                    leftIcon={<Compass className="w-4 h-4" />}
                    className="border-slate-300 dark:border-slate-700 text-text-main dark:text-white hover:bg-white dark:hover:bg-slate-800"
                  >
                    Try Predictions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
