import React from 'react';
import { Activity, Github, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-navy-950 border-t border-border-light dark:border-border-dark pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-1">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 group text-left cursor-pointer select-none"
              title="Home / Back to Top"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-sm shadow-primary/20">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-navy-900 dark:text-white group-hover:text-primary transition-colors">
                JOB<span className="text-primary">PULSE</span>
              </span>
            </button>
            <p className="text-xs text-text-muted dark:text-text-darkMuted leading-relaxed">
              Machine Learning-Based Job Market Demand Prediction and Skill Trend Analysis Using Historical Job Posting Data.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-main dark:text-text-darkMain mb-4">
              Analytics & Forecast
            </h4>
            <ul className="space-y-2 text-sm text-text-muted dark:text-text-darkMuted">
              <li>
                <Link to="/dashboard" className="hover:text-primary transition-colors">
                  Overview Dashboard
                </Link>
              </li>
              <li>
                <Link to="/job-trends" className="hover:text-primary transition-colors">
                  Job Role Trends
                </Link>
              </li>
              <li>
                <Link to="/skill-trends" className="hover:text-primary transition-colors">
                  In-Demand Skills
                </Link>
              </li>
              <li>
                <Link to="/predictions" className="hover:text-primary transition-colors">
                  Demand Prediction
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-main dark:text-text-darkMain mb-4">
              Career Tools
            </h4>
            <ul className="space-y-2 text-sm text-text-muted dark:text-text-darkMuted">
              <li>
                <Link to="/skill-gap" className="hover:text-primary transition-colors">
                  Skill Gap Analyzer
                </Link>
              </li>
              <li>
                <Link to="/salary-estimator" className="hover:text-primary transition-colors">
                  Salary Estimator
                </Link>
              </li>
              <li>
                <Link to="/career-roadmap" className="hover:text-primary transition-colors">
                  Career Roadmap
                </Link>
              </li>
              <li>
                <Link to="/role-comparison" className="hover:text-primary transition-colors">
                  Role Comparison
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-main dark:text-text-darkMain mb-4">
              About Project
            </h4>
            <p className="text-xs text-text-muted dark:text-text-darkMuted leading-relaxed mb-3">
              A student machine learning project predicting tech job demand and analyzing skill trends using historical data.
            </p>
            <div className="flex items-center gap-3 text-text-muted">
              <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono">
                v1.0
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted dark:text-text-darkMuted">
          <p>© {new Date().getFullYear()} JobPulse — Job Market Intelligence Project.</p>
          <div className="mt-2 sm:mt-0 flex items-center gap-4">
            <span>Built with React, Express & FastAPI</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              Back to Top &uarr;
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

