import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { JobTrendsPage } from '../pages/job-trends/JobTrendsPage';
import { SkillTrendsPage } from '../pages/skill-trends/SkillTrendsPage';
import { PredictionsPage } from '../pages/predictions/PredictionsPage';
import { ModelPerformancePage } from '../pages/model-performance/ModelPerformancePage';
import { DatasetsPage } from '../pages/datasets/DatasetsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { SkillGapPage } from '../pages/skill-gap/SkillGapPage';
import { SalaryEstimatorPage } from '../pages/salary-estimator/SalaryEstimatorPage';
import { CareerRoadmapPage } from '../pages/career-roadmap/CareerRoadmapPage';
import { RoleComparisonPage } from '../pages/role-comparison/RoleComparisonPage';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Dashboard App Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/job-trends" element={<JobTrendsPage />} />
        <Route path="/skill-trends" element={<SkillTrendsPage />} />
        <Route path="/predictions" element={<PredictionsPage />} />
        <Route path="/skill-gap" element={<SkillGapPage />} />
        <Route path="/salary-estimator" element={<SalaryEstimatorPage />} />
        <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
        <Route path="/role-comparison" element={<RoleComparisonPage />} />
        <Route path="/model-performance" element={<ModelPerformancePage />} />
        <Route
          path="/datasets"
          element={
            <ProtectedRoute adminOnly>
              <DatasetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

