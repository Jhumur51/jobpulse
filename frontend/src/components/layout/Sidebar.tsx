import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  BrainCircuit,
  Compass,
  Gauge,
  Database,
  Settings,
  Activity,
  LogOut,
  ShieldCheck,
  Target,
  DollarSign,
  BookOpen,
  ArrowRightLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { user, isAdmin, logout } = useAuth();

  const analyticsNav = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Job Trends', path: '/job-trends', icon: TrendingUp },
    { name: 'Top Skills', path: '/skill-trends', icon: BrainCircuit },
    { name: 'Demand Forecast', path: '/predictions', icon: Compass },
  ];

  const careerNav = [
    { name: 'Skill Gap Analyzer', path: '/skill-gap', icon: Target },
    { name: 'Salary Estimator', path: '/salary-estimator', icon: DollarSign },
    { name: 'Career Roadmap', path: '/career-roadmap', icon: BookOpen },
    { name: 'Role Comparison', path: '/role-comparison', icon: ArrowRightLeft },
  ];

  const systemNav = [
    { name: 'Model Metrics', path: '/model-performance', icon: Gauge },
    { name: 'Datasets', path: '/datasets', icon: Database, adminOnly: true },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-card-dark border-r border-border-light dark:border-border-dark flex flex-col transition-transform duration-200 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-border-light dark:border-border-dark">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/20">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-navy-900 dark:text-white">
                JOB<span className="text-primary">PULSE</span>
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
          {/* Analytics Group */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
              Analytics
            </div>
            {analyticsNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary font-semibold shadow-xs'
                        : 'text-text-muted dark:text-text-darkMuted hover:text-text-main dark:hover:text-text-darkMain hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Career Tools Group (New Best 4 Modules) */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              Career Tools
            </div>
            {careerNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary font-semibold shadow-xs'
                        : 'text-text-muted dark:text-text-darkMuted hover:text-text-main dark:hover:text-text-darkMain hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* System & Settings */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
              Management
            </div>
            {systemNav.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary font-semibold shadow-xs'
                        : 'text-text-muted dark:text-text-darkMuted hover:text-text-main dark:hover:text-text-darkMain hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {item.adminOnly && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
                      Admin
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary font-bold flex items-center justify-center text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold truncate text-text-main dark:text-text-darkMain">
                  {user?.name || 'Researcher'}
                </p>
                {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
              </div>
              <p className="text-xs text-text-muted dark:text-text-darkMuted truncate">
                {user?.email || 'user@jobpulse.ai'}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-text-muted hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

