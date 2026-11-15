import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    if (pathname.includes('/job-trends')) return 'Job Market Demand Trends';
    if (pathname.includes('/skill-trends')) return 'Skill Intelligence & Growth Dynamics';
    if (pathname.includes('/predictions')) return 'Machine Learning Demand Forecasting';
    if (pathname.includes('/model-performance')) return 'Predictive Model Evaluation & Benchmarks';
    if (pathname.includes('/datasets')) return 'Dataset Corpus & Feature Management';
    if (pathname.includes('/settings')) return 'Platform Preferences & Account';
    return 'Executive Overview Dashboard';
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col flex-1">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          title={getPageTitle(location.pathname)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

