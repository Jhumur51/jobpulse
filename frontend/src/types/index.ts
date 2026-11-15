export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface DashboardSummary {
  totalJobPostings: number;
  uniqueJobRoles: number;
  skillsIdentified: number;
  industriesCovered: number;
  activeLocations: number;
  isDemo?: boolean;
}

export interface MonthlyVolume {
  month: string;
  volume: number;
}

export interface TopRole {
  role: string;
  postings: number;
  share: number;
}

export interface TopSkill {
  skill: string;
  count: number;
  category: string;
}

export interface DistributionItem {
  industry?: string;
  location?: string;
  level?: string;
  degree?: string;
  count: number;
  percentage: number;
}

export interface JobPosting {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  industry: string;
  experience?: string;
  education?: string;
  salary?: string;
  postingDate: string;
  totalPostings?: number;
  skills: string[];
}

export interface SkillItem {
  name: string;
  category: string;
  frequency: number;
  historical_trajectory: number[];
  growth_percentage: number;
  trend_classification: 'Emerging' | 'High-Demand' | 'Stable' | 'Declining';
  demand_index: number;
}

export interface PredictionRequest {
  jobRole: string;
  location?: string;
  industry?: string;
  horizon: number;
  modelName?: string;
}

export interface MonthlyForecastPoint {
  month: string;
  predicted_volume: number;
  lower_bound: number;
  upper_bound: number;
}

export interface HistoricalPoint {
  month: string;
  actual_volume: number;
}

export interface PredictionResponse {
  predictionId?: string;
  success: boolean;
  job_role: string;
  location: string;
  industry: string;
  horizon_months: number;
  predicted_demand: number;
  predicted_posting_volume: number;
  growth_percentage: number;
  historical_baseline: number;
  model_name: string;
  model_version: string;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  trend_direction: 'Increasing' | 'Stable' | 'Decreasing';
  monthly_forecast: MonthlyForecastPoint[];
  historical_data: HistoricalPoint[];
  disclaimer: string;
}

export interface ModelMetric {
  model_name: string;
  mae: number;
  mse: number;
  rmse: number;
  mape: number;
  r2: number;
  training_samples: number;
  feature_count: number;
  training_date: string;
  description: string;
}

export interface ModelPerformanceData {
  success: boolean;
  models: ModelMetric[];
  best_model: string;
  dataset_info: {
    source: string;
    total_records: number;
    roles_tracked: number;
    time_range: string;
    frequency: string;
  };
}

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  source: string;
  recordCount: number;
  status: string;
  isDemo: boolean;
  createdAt: string;
  analysis?: {
    headers: string[];
    totalRows: number;
    preview: Record<string, string>[];
    missingStats: Record<string, number>;
    duplicateCount: number;
  };
}

export interface SkillGapResult {
  targetRole: string;
  matchPercentage: number;
  statusLabel: string;
  statusBadge: 'success' | 'warning' | 'primary' | 'neutral';
  userSkillCount: number;
  userSkills: string[];
  matchedSkills: string[];
  missingCoreSkills: string[];
  matchedBonusSkills: string[];
  missingBonusSkills: string[];
  topRecommendations: string[];
  roleEstimatedGrowth: string;
  roleDemandIndex: number;
}

export interface SalaryEstimateResult {
  role: string;
  experienceLevel: string;
  location: string;
  currency: string;
  estimatedMin: number;
  estimatedMedian: number;
  estimatedMax: number;
  experienceProgression: { level: string; salary: number }[];
  highPayingSkills: { skill: string; bonus: number }[];
  appliedSkillBonus: number;
  dataBasis: string;
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  title: string;
  description: string;
  topics: string[];
  tools: string[];
}

export interface CareerRoadmapResult {
  role: string;
  estimatedTime: string;
  phases: RoadmapPhase[];
  projectIdeas: { level: string; title: string; description: string }[];
  freeResources: { name: string; url: string }[];
}

export interface RoleComparisonResult {
  roleA: {
    name: string;
    baseSalary: number;
    growthRate: string;
    demandIndex: number;
    coreSkillCount: number;
  };
  roleB: {
    name: string;
    baseSalary: number;
    growthRate: string;
    demandIndex: number;
    coreSkillCount: number;
  };
  commonSkills: string[];
  uniqueToA: string[];
  uniqueToB: string[];
  monthlyComparison: { month: string; [key: string]: string | number }[];
  comparisonTakeaway: string;
}


