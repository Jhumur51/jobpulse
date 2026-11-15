const prisma = require('../config/database');

const DEMO_MONTHLY_VOLUME = [
  { month: '2024-07', volume: 18450 },
  { month: '2024-08', volume: 19200 },
  { month: '2024-09', volume: 21400 },
  { month: '2024-10', volume: 22100 },
  { month: '2024-11', volume: 20800 },
  { month: '2024-12', volume: 16900 },
  { month: '2025-01', volume: 24500 },
  { month: '2025-02', volume: 25800 },
  { month: '2025-03', volume: 26400 },
  { month: '2025-04', volume: 27100 },
  { month: '2025-05', volume: 28300 },
  { month: '2025-06', volume: 29500 },
];

const DEMO_TOP_ROLES = [
  { role: 'Software Engineer', postings: 68400, share: 19.4 },
  { role: 'Full Stack Developer', postings: 54200, share: 15.3 },
  { role: 'Data Scientist', postings: 41800, share: 11.8 },
  { role: 'Machine Learning Engineer', postings: 38900, share: 11.0 },
  { role: 'DevOps Engineer', postings: 36200, share: 10.2 },
  { role: 'Frontend Developer', postings: 32100, share: 9.1 },
  { role: 'Cloud Solutions Architect', postings: 28400, share: 8.0 },
  { role: 'Data Analyst', postings: 24700, share: 7.0 },
  { role: 'Cybersecurity Analyst', postings: 19200, share: 5.4 },
  { role: 'AI Research Scientist', postings: 9800, share: 2.8 },
];

const DEMO_TOP_SKILLS = [
  { skill: 'Python', count: 62400, category: 'Programming' },
  { skill: 'SQL', count: 58600, category: 'Data & Analytics' },
  { skill: 'AWS', count: 54200, category: 'Cloud & DevOps' },
  { skill: 'Docker', count: 46200, category: 'Cloud & DevOps' },
  { skill: 'React.js', count: 44300, category: 'Web Development' },
  { skill: 'TypeScript', count: 41500, category: 'Programming' },
  { skill: 'Kubernetes', count: 38900, category: 'Cloud & DevOps' },
  { skill: 'Node.js', count: 37100, category: 'Web Development' },
  { skill: 'PyTorch', count: 28400, category: 'AI & ML' },
  { skill: 'Snowflake / BigQuery', count: 27900, category: 'Data & Analytics' },
];

const DEMO_INDUSTRIES = [
  { industry: 'Technology', count: 142000, percentage: 40.2 },
  { industry: 'Finance & Banking', count: 78500, percentage: 22.2 },
  { industry: 'Healthcare', count: 49800, percentage: 14.1 },
  { industry: 'E-commerce & Retail', count: 44200, percentage: 12.5 },
  { industry: 'Manufacturing & Telecom', count: 24100, percentage: 6.8 },
  { industry: 'Education', count: 14600, percentage: 4.2 },
];

const DEMO_LOCATIONS = [
  { location: 'Remote', count: 118400, percentage: 33.5 },
  { location: 'San Francisco, CA', count: 64200, percentage: 18.2 },
  { location: 'New York, NY', count: 52100, percentage: 14.8 },
  { location: 'Austin, TX', count: 34800, percentage: 9.9 },
  { location: 'Seattle, WA', count: 31200, percentage: 8.8 },
  { location: 'London, UK', count: 28900, percentage: 8.2 },
  { location: 'Toronto, Canada', count: 14200, percentage: 4.0 },
  { location: 'Dhaka, Bangladesh', count: 9400, percentage: 2.6 },
];

const DEMO_EXPERIENCE = [
  { level: 'Entry-Level (0-2 yrs)', count: 68400, percentage: 19.4 },
  { level: 'Mid-Level (3-5 yrs)', count: 168200, percentage: 47.6 },
  { level: 'Senior (6-8 yrs)', count: 91400, percentage: 25.9 },
  { level: 'Lead / Principal (9+ yrs)', count: 25200, percentage: 7.1 },
];

const DEMO_EDUCATION = [
  { degree: "Bachelor's Degree", count: 215400, percentage: 61.0 },
  { degree: "Master's Degree", count: 88200, percentage: 25.0 },
  { degree: 'PhD / Research Focus', count: 24100, percentage: 6.8 },
  { degree: 'Self-Taught / Bootcamp', count: 25500, percentage: 7.2 },
];

class AnalyticsService {
  async getSummaryKPIs() {
    let counts = {
      totalJobPostings: 353200,
      uniqueJobRoles: 15,
      skillsIdentified: 25,
      industriesCovered: 6,
      activeLocations: 11,
      isDemo: true,
    };

    if (prisma && prisma.$isAvailable) {
      try {
        const total = await prisma.jobPosting.count();
        if (total > 0) {
          const roles = await prisma.jobPosting.findMany({
            distinct: ['jobTitle'],
            select: { jobTitle: true },
          });
          const skills = await prisma.skill.count();
          const industries = await prisma.jobPosting.findMany({
            distinct: ['industry'],
            select: { industry: true },
          });
          const locations = await prisma.jobPosting.findMany({
            distinct: ['location'],
            select: { location: true },
          });

          counts = {
            totalJobPostings: total,
            uniqueJobRoles: roles.length,
            skillsIdentified: skills,
            industriesCovered: industries.length,
            activeLocations: locations.length,
            isDemo: false,
          };
        }
      } catch (err) {
        // Fallback to demo
      }
    }

    return counts;
  }

  async getJobVolumeOverTime() {
    return DEMO_MONTHLY_VOLUME;
  }

  async getTopRoles() {
    return DEMO_TOP_ROLES;
  }

  async getTopSkills() {
    return DEMO_TOP_SKILLS;
  }

  async getIndustryDistribution() {
    return DEMO_INDUSTRIES;
  }

  async getLocationDistribution() {
    return DEMO_LOCATIONS;
  }

  async getExperienceDistribution() {
    return DEMO_EXPERIENCE;
  }

  async getEducationDistribution() {
    return DEMO_EDUCATION;
  }
}

module.exports = new AnalyticsService();
