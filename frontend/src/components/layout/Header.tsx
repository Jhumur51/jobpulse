import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Database,
  Calendar,
  Bell,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, title }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Dropdown states
  const [datasetDropdownOpen, setDatasetDropdownOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('Global Benchmark 2021-2026');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Recent 12M + 6M ML');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Best Model Evaluated',
      desc: 'Gradient Boosting Regressor achieved 0.9867 R² benchmark.',
      time: '10m ago',
      read: false,
    },
    {
      id: '2',
      title: 'Emerging Skill Spike',
      desc: 'LLMs & Prompt Engineering demand surged +428% YoY.',
      time: '1h ago',
      read: false,
    },
    {
      id: '3',
      title: 'Corpus Synchronized',
      desc: '353,200 longitudinal postings indexed in feature store.',
      time: '2h ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const datasetRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datasetRef.current && !datasetRef.current.contains(event.target as Node)) {
        setDatasetDropdownOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setDateDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-card-dark/95 backdrop-blur-md border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 sm:px-8">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <h2 className="hidden sm:block text-lg font-bold tracking-tight text-navy-900 dark:text-white">
            {title}
          </h2>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Interactive Dataset Selector Dropdown */}
        <div className="relative hidden md:block" ref={datasetRef}>
          <button
            onClick={() => setDatasetDropdownOpen(!datasetDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-border-light dark:border-border-dark text-xs font-medium text-text-muted dark:text-text-darkMuted transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Dataset:</span>
            <span className="font-semibold text-text-main dark:text-text-darkMain max-w-[140px] truncate">
              {selectedDataset}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {datasetDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border-light dark:border-border-dark">
                Select Active Dataset
              </div>
              {[
                'Global Benchmark 2021-2026',
                'Emerging AI & MLOps Sample',
                'North American Tech Postings',
              ].map((ds) => (
                <button
                  key={ds}
                  onClick={() => {
                    setSelectedDataset(ds);
                    setDatasetDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between transition-colors"
                >
                  <span className={selectedDataset === ds ? 'font-bold text-primary' : 'text-text-main dark:text-text-darkMain'}>
                    {ds}
                  </span>
                  {selectedDataset === ds && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
              <div className="border-t border-border-light dark:border-border-dark mt-1 pt-1 px-2">
                <button
                  onClick={() => {
                    setDatasetDropdownOpen(false);
                    navigate('/datasets');
                  }}
                  className="w-full text-left px-2 py-1.5 text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md font-semibold flex items-center justify-between"
                >
                  <span>Manage / Upload Datasets</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Date Range Dropdown */}
        <div className="relative hidden lg:block" ref={dateRef}>
          <button
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-border-light dark:border-border-dark text-xs font-medium text-text-muted dark:text-text-darkMuted transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Horizon:</span>
            <span className="font-semibold text-text-main dark:text-text-darkMain">
              {selectedRange}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dateDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border-light dark:border-border-dark">
                Timeline Window
              </div>
              {[
                'Recent 12M + 6M ML',
                'Recent 6M + 3M ML',
                'Recent 24M Longitudinal',
                'All-Time Data (2021-2026)',
              ].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setSelectedRange(range);
                    setDateDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between transition-colors"
                >
                  <span className={selectedRange === range ? 'font-bold text-emerald-600' : 'text-text-main dark:text-text-darkMain'}>
                    {range}
                  </span>
                  {selectedRange === range && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="View notifications"
            className="relative p-2 rounded-lg text-text-muted hover:text-text-main dark:hover:text-text-darkMain hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-card-dark" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-2xl py-3 z-50 text-xs">
              <div className="flex items-center justify-between px-4 pb-2.5 border-b border-border-light dark:border-border-dark">
                <span className="font-bold text-sm text-navy-900 dark:text-white">
                  Notifications ({unreadCount} new)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Mark read
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="text-[11px] text-text-muted hover:text-danger"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-border-light dark:divide-border-dark">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-text-muted">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                        );
                      }}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-text-main dark:text-text-darkMain">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-text-muted">{n.time}</span>
                      </div>
                      <p className="text-text-muted leading-relaxed text-[11px]">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle visual theme"
          className="p-2 rounded-lg text-text-muted hover:text-text-main dark:hover:text-text-darkMain hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Profile Menu Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/20 transition-all focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-xl py-2 z-50 text-xs">
              <div className="px-4 py-2.5 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-1.5 font-bold text-text-main dark:text-text-darkMain">
                  <span>{user?.name || 'Researcher'}</span>
                  {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
                </div>
                <div className="text-[11px] text-text-muted truncate mt-0.5">
                  {user?.email || 'user@jobpulse.ai'}
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-text-darkMain transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-text-muted" />
                  <span>Profile Settings</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/datasets"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-text-darkMain transition-colors"
                  >
                    <Database className="w-3.5 h-3.5 text-primary" />
                    <span>Dataset Manager</span>
                  </Link>
                )}
                <Link
                  to="/predictions"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-text-darkMain transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Demand Forecaster</span>
                </Link>
              </div>

              <div className="border-t border-border-light dark:border-border-dark pt-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
