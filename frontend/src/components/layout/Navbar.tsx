import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  TrendingUp,
  BrainCircuit,
  Compass,
  Gauge,
  Database,
  Layers,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Code2,
  Cpu,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

type NavMenu = 'features' | 'analytics' | 'career' | 'models' | 'methodology' | null;

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<NavMenu>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (menu: NavMenu) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const handleHomeClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveMenu(null);
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  const handleScrollTo = (sectionId: string) => {
    setActiveMenu(null);
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-bg-dark/95 backdrop-blur-md border-b border-border-light dark:border-border-dark transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={navRef}>
        <div className="flex items-center justify-between h-16">
          {/* Logo / Home Button */}
          <Link
            to="/"
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 group cursor-pointer select-none"
            title="Home / Back to Top"
            aria-label="JobPulse Home"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 group-hover:shadow-primary/30 transition-all">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-navy-900 dark:text-white group-hover:text-primary transition-colors">
                JOB<span className="text-primary">PULSE</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-primary border border-blue-100 dark:bg-blue-900/40 dark:border-blue-800">
                ML Project
              </span>
            </div>
          </Link>

          {/* Desktop Interactive Nav Menu Buttons */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-text-muted dark:text-text-darkMuted">
            {/* Features Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('features')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeMenu === 'features'
                    ? 'text-primary bg-primary/10'
                    : 'hover:text-text-main dark:hover:text-text-darkMain hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Features</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'features' ? 'rotate-180 text-primary' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Features Interactive Mega Popover */}
              {activeMenu === 'features' && (
                <div className="absolute left-0 mt-2 w-[440px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-xl p-4 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-light dark:border-border-dark">
                    <span className="font-bold text-xs uppercase tracking-wider text-text-muted">
                      Main Modules
                    </span>
                    <button
                      onClick={() => handleScrollTo('features')}
                      className="text-primary hover:underline font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <span>Jump to Section</span> &darr;
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      to="/predictions"
                      onClick={() => setActiveMenu(null)}
                      className="p-3 rounded-xl border border-border-light dark:border-border-dark hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                          <Compass className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-navy-900 dark:text-white group-hover:text-primary transition-colors">
                          Demand Forecast
                        </h4>
                        <p className="text-[11px] text-text-muted mt-1 leading-snug">
                          3–12 month prediction using regression models.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-primary mt-3 inline-flex items-center gap-0.5">
                        Try Forecast <ChevronRight className="w-3 h-3" />
                      </span>
                    </Link>

                    <Link
                      to="/skill-trends"
                      onClick={() => setActiveMenu(null)}
                      className="p-3 rounded-xl border border-border-light dark:border-border-dark hover:border-purple-500 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                          <BrainCircuit className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-navy-900 dark:text-white group-hover:text-purple-600 transition-colors">
                          Skill Trends
                        </h4>
                        <p className="text-[11px] text-text-muted mt-1 leading-snug">
                          See in-demand and growing tech skills.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-purple-600 mt-3 inline-flex items-center gap-0.5">
                        View Skills <ChevronRight className="w-3 h-3" />
                      </span>
                    </Link>

                    <Link
                      to="/job-trends"
                      onClick={() => setActiveMenu(null)}
                      className="p-3 rounded-xl border border-border-light dark:border-border-dark hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-navy-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                          Job Roles
                        </h4>
                        <p className="text-[11px] text-text-muted mt-1 leading-snug">
                          Hiring numbers across 15 tech disciplines.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 mt-3 inline-flex items-center gap-0.5">
                        Role Trends <ChevronRight className="w-3 h-3" />
                      </span>
                    </Link>

                    <Link
                      to="/datasets"
                      onClick={() => setActiveMenu(null)}
                      className="p-3 rounded-xl border border-border-light dark:border-border-dark hover:border-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                          <Database className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-navy-900 dark:text-white group-hover:text-amber-600 transition-colors">
                          Datasets
                        </h4>
                        <p className="text-[11px] text-text-muted mt-1 leading-snug">
                          CSV dataset upload and sample inspection.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 mt-3 inline-flex items-center gap-0.5">
                        Manage Data <ChevronRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Analytics Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('analytics')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeMenu === 'analytics'
                    ? 'text-primary bg-primary/10'
                    : 'hover:text-text-main dark:hover:text-text-darkMain hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Analytics</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'analytics' ? 'rotate-180 text-primary' : 'text-slate-400'
                  }`}
                />
              </button>

              {activeMenu === 'analytics' && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-xl p-4 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border-light dark:border-border-dark">
                    <span className="font-bold text-xs uppercase tracking-wider text-text-muted">
                      Analytics Pages
                    </span>
                    <button
                      onClick={() => handleScrollTo('analytics')}
                      className="text-primary hover:underline font-semibold text-[11px]"
                    >
                      Jump to Section &darr;
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <Link
                      to="/dashboard"
                      onClick={() => setActiveMenu(null)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-primary flex items-center justify-center shrink-0">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-main dark:text-text-darkMain group-hover:text-primary">
                          Overview Dashboard
                        </p>
                        <p className="text-[11px] text-text-muted truncate">
                          Summary numbers, charts, and key stats
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/job-trends"
                      onClick={() => setActiveMenu(null)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-main dark:text-text-darkMain group-hover:text-emerald-600">
                          Role Comparison
                        </p>
                        <p className="text-[11px] text-text-muted truncate">
                          Compare job openings across roles
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/skill-trends"
                      onClick={() => setActiveMenu(null)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-main dark:text-text-darkMain group-hover:text-purple-600">
                          Top Skills
                        </p>
                        <p className="text-[11px] text-text-muted truncate">
                          Growing technologies and common tools
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Career Tools Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('career')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeMenu === 'career'
                    ? 'text-primary bg-primary/10'
                    : 'hover:text-text-main dark:hover:text-text-darkMain hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Career Tools</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'career' ? 'rotate-180 text-primary' : 'text-slate-400'
                  }`}
                />
              </button>

              {activeMenu === 'career' && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-xl p-4 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border-light dark:border-border-dark">
                    <span className="font-bold text-xs uppercase tracking-wider text-text-muted">
                      Career Planning Tools
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <Link
                      to="/skill-gap"
                      onClick={() => setActiveMenu(null)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-primary flex items-center justify-center shrink-0">
                        <BrainCircuit className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-main dark:text-text-darkMain group-hover:text-primary">
                          Skill Gap Analyzer
                        </p>
                        <p className="text-[11px] text-text-muted truncate">
                          Match your skills to roles & find gaps
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/salary-estimator"
                      onClick={() => setActiveMenu(null)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-main dark:text-text-darkMain group-hover:text-emerald-600">
                          Salary Estimator
                        </p>
                        <p className="text-[11px] text-text-muted truncate">
                          Expected compensation by role & location
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/career-roadmap"
                      onClick={() => setActiveMenu(null)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center shrink-0">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-main dark:text-text-darkMain group-hover:text-purple-600">
                          Career Roadmap
                        </p>
                        <p className="text-[11px] text-text-muted truncate">
                          Step-by-step learning paths & projects
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/role-comparison"
                      onClick={() => setActiveMenu(null)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-main dark:text-text-darkMain group-hover:text-amber-600">
                          Role Comparison
                        </p>
                        <p className="text-[11px] text-text-muted truncate">
                          Compare two tech roles head-to-head
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ML Models Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('models')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeMenu === 'models'
                    ? 'text-primary bg-primary/10'
                    : 'hover:text-text-main dark:hover:text-text-darkMain hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>ML Models</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'models' ? 'rotate-180 text-primary' : 'text-slate-400'
                  }`}
                />
              </button>

              {activeMenu === 'models' && (
                <div className="absolute left-0 mt-2 w-88 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-xl p-4 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border-light dark:border-border-dark">
                    <span className="font-bold text-xs uppercase tracking-wider text-text-muted">
                      Trained Models
                    </span>
                    <button
                      onClick={() => handleScrollTo('ml-models')}
                      className="text-primary hover:underline font-semibold text-[11px]"
                    >
                      Jump to Section &darr;
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-text-main dark:text-text-darkMain">
                            Gradient Boosting Regressor
                          </span>
                          <Badge variant="success" size="sm">
                            Best
                          </Badge>
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5 font-mono">
                          R²: 0.9867 (98.6%) • RMSE: 135.5
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-text-main dark:text-text-darkMain">
                          Random Forest Regressor
                        </span>
                        <p className="text-[11px] text-text-muted mt-0.5 font-mono">
                          R²: 0.9841 • RMSE: 148.2
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-text-main dark:text-text-darkMain">
                          Ridge Regression
                        </span>
                        <p className="text-[11px] text-text-muted mt-0.5 font-mono">
                          R²: 0.9665 • RMSE: 210.8
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-border-light dark:border-border-dark">
                    <Link
                      to="/model-performance"
                      onClick={() => setActiveMenu(null)}
                      className="w-full py-2 px-3 rounded-lg bg-primary text-white text-center font-semibold text-xs hover:bg-primary-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Gauge className="w-3.5 h-3.5" /> View All Model Metrics
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Methodology Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('methodology')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeMenu === 'methodology'
                    ? 'text-primary bg-primary/10'
                    : 'hover:text-text-main dark:hover:text-text-darkMain hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Methodology</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'methodology' ? 'rotate-180 text-primary' : 'text-slate-400'
                  }`}
                />
              </button>

              {activeMenu === 'methodology' && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-xl p-4 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border-light dark:border-border-dark">
                    <span className="font-bold text-xs uppercase tracking-wider text-text-muted">
                      Project Workflow
                    </span>
                    <button
                      onClick={() => handleScrollTo('methodology')}
                      className="text-primary hover:underline font-semibold text-[11px]"
                    >
                      Jump to Section &darr;
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                        1
                      </div>
                      <div>
                        <span className="font-bold text-text-main dark:text-text-darkMain block">
                          Data Cleaning
                        </span>
                        <span className="text-[11px] text-text-muted leading-tight">
                          Remove duplicates and extract skills and titles.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                        2
                      </div>
                      <div>
                        <span className="font-bold text-text-main dark:text-text-darkMain block">
                          Feature Engineering
                        </span>
                        <span className="text-[11px] text-text-muted leading-tight">
                          Calculate past month lags and moving averages.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                        3
                      </div>
                      <div>
                        <span className="font-bold text-text-main dark:text-text-darkMain block">
                          Model Training & Evaluation
                        </span>
                        <span className="text-[11px] text-text-muted leading-tight">
                          Train regression models and measure test accuracy.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Live Forecast Link */}
            <Link
              to="/predictions"
              onClick={() => setActiveMenu(null)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Live Forecast</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-text-muted hover:text-text-main dark:hover:text-text-darkMain hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  Log out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Interactive Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-light dark:border-border-dark bg-white dark:bg-bg-dark px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col space-y-1 font-medium text-sm text-text-muted dark:text-text-darkMuted">
            <button
              onClick={handleHomeClick}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-primary font-bold"
            >
              <span>Home</span>
              <span className="text-xs font-bold">Top &uarr;</span>
            </button>

            <button
              onClick={() => handleScrollTo('features')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span className="font-semibold text-text-main dark:text-text-darkMain">Features</span>
              <span className="text-xs text-primary font-bold">Explore &darr;</span>
            </button>

            <button
              onClick={() => handleScrollTo('analytics')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span className="font-semibold text-text-main dark:text-text-darkMain">Analytics</span>
              <span className="text-xs text-primary font-bold">Overview &darr;</span>
            </button>

            <button
              onClick={() => handleScrollTo('ml-models')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span className="font-semibold text-text-main dark:text-text-darkMain">ML Models</span>
              <span className="text-xs text-primary font-bold">Benchmarks &darr;</span>
            </button>

            <button
              onClick={() => handleScrollTo('methodology')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span className="font-semibold text-text-main dark:text-text-darkMain">Methodology</span>
              <span className="text-xs text-primary font-bold">Pipeline &darr;</span>
            </button>

            <Link
              to="/predictions"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-primary font-semibold flex items-center justify-between"
            >
              <span>Live Demand Forecast</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </Link>
          </nav>

          <div className="pt-4 border-t border-border-light dark:border-border-dark flex flex-col gap-2">
            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
