const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const prisma = require('../config/database');

// Realistic Job Postings Pool
const MOCK_JOBS = [
  {
    id: 'job-101',
    jobTitle: 'Senior Machine Learning Engineer',
    company: 'NeuralStack AI',
    location: 'San Francisco, CA',
    industry: 'Technology',
    experience: 'Senior (6-8 yrs)',
    education: "Master's Degree",
    salary: '$180,000 - $240,000',
    postingDate: '2026-06-15',
    totalPostings: 1420,
    skills: ['PyTorch', 'Large Language Models (LLMs)', 'Docker', 'Python', 'Kubernetes'],
  },
  {
    id: 'job-102',
    jobTitle: 'Full Stack Developer',
    company: 'FinEdge Systems',
    location: 'New York, NY',
    industry: 'Finance & Banking',
    experience: 'Mid-Level (3-5 yrs)',
    education: "Bachelor's Degree",
    salary: '$135,000 - $175,000',
    postingDate: '2026-06-12',
    totalPostings: 2850,
    skills: ['React.js', 'Node.js', 'TypeScript', 'SQL', 'AWS'],
  },
  {
    id: 'job-103',
    jobTitle: 'Cloud Solutions Architect',
    company: 'Apex Cloud Platforms',
    location: 'Seattle, WA',
    industry: 'Technology',
    experience: 'Lead / Principal (9+ yrs)',
    education: "Bachelor's Degree",
    salary: '$210,000 - $275,000',
    postingDate: '2026-06-10',
    totalPostings: 980,
    skills: ['Amazon Web Services (AWS)', 'Terraform', 'Kubernetes', 'Docker'],
  },
  {
    id: 'job-104',
    jobTitle: 'Data Scientist',
    company: 'BioHealth Analytics',
    location: 'Remote',
    industry: 'Healthcare',
    experience: 'Mid-Level (3-5 yrs)',
    education: "Master's Degree",
    salary: '$140,000 - $185,000',
    postingDate: '2026-06-08',
    totalPostings: 1890,
    skills: ['Python', 'SQL', 'Scikit-Learn', 'Apache Spark'],
  },
  {
    id: 'job-105',
    jobTitle: 'DevOps Engineer',
    company: 'HyperScale Commerce',
    location: 'Austin, TX',
    industry: 'E-commerce & Retail',
    experience: 'Mid-Level (3-5 yrs)',
    education: "Bachelor's Degree",
    salary: '$130,000 - $165,000',
    postingDate: '2026-06-05',
    totalPostings: 1640,
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
  },
  {
    id: 'job-106',
    jobTitle: 'Cybersecurity Analyst',
    company: 'ShieldNet Defense',
    location: 'London, UK',
    industry: 'Finance & Banking',
    experience: 'Mid-Level (3-5 yrs)',
    education: "Bachelor's Degree",
    salary: '£85,000 - £110,000',
    postingDate: '2026-06-03',
    totalPostings: 890,
    skills: ['SIEM & SOC Operations', 'Network Security', 'Zero Trust Architecture'],
  },
  {
    id: 'job-107',
    jobTitle: 'Frontend Developer',
    company: 'CreativePulse Labs',
    location: 'Remote',
    industry: 'Technology',
    experience: 'Entry-Level (0-2 yrs)',
    education: 'Self-Taught / Bootcamp',
    salary: '$85,000 - $115,000',
    postingDate: '2026-06-01',
    totalPostings: 1750,
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js'],
  },
  {
    id: 'job-108',
    jobTitle: 'AI Research Scientist',
    company: 'Synthetica Intelligence',
    location: 'San Francisco, CA',
    industry: 'Technology',
    experience: 'Senior (6-8 yrs)',
    education: 'PhD / Research Focus',
    salary: '$240,000 - $320,000',
    postingDate: '2026-05-28',
    totalPostings: 430,
    skills: ['PyTorch', 'Large Language Models (LLMs)', 'Vector Databases (RAG)'],
  },
  {
    id: 'job-109',
    jobTitle: 'Software Engineer',
    company: 'Dhaka Tech Solutions',
    location: 'Dhaka, Bangladesh',
    industry: 'Technology',
    experience: 'Mid-Level (3-5 yrs)',
    education: "Bachelor's Degree",
    salary: '৳1,200,000 - ৳1,800,000/yr',
    postingDate: '2026-05-25',
    totalPostings: 620,
    skills: ['Python', 'Django', 'React.js', 'PostgreSQL'],
  },
  {
    id: 'job-110',
    jobTitle: 'Data Analyst',
    company: 'Global Retail Insights',
    location: 'Toronto, Canada',
    industry: 'E-commerce & Retail',
    experience: 'Entry-Level (0-2 yrs)',
    education: "Bachelor's Degree",
    salary: 'CAD 75,000 - 95,000',
    postingDate: '2026-05-20',
    totalPostings: 1120,
    skills: ['SQL', 'Tableau', 'Python', 'Power BI'],
  },
];

const getJobs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    location = '',
    industry = '',
    experience = '',
    education = '',
    sortBy = 'postingDate',
    sortOrder = 'desc',
  } = req.query;

  let filtered = [...MOCK_JOBS];

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.jobTitle.toLowerCase().includes(s) ||
        j.company.toLowerCase().includes(s) ||
        j.skills.some((sk) => sk.toLowerCase().includes(s))
    );
  }

  if (location && location !== 'All') {
    filtered = filtered.filter((j) => j.location.toLowerCase() === location.toLowerCase());
  }

  if (industry && industry !== 'All') {
    filtered = filtered.filter((j) => j.industry.toLowerCase() === industry.toLowerCase());
  }

  if (experience && experience !== 'All') {
    filtered = filtered.filter((j) => j.experience?.toLowerCase().includes(experience.toLowerCase()));
  }

  if (education && education !== 'All') {
    filtered = filtered.filter((j) => j.education?.toLowerCase().includes(education.toLowerCase()));
  }

  // Sorting
  filtered.sort((a, b) => {
    let valA = a[sortBy] || '';
    let valB = b[sortBy] || '';
    if (sortBy === 'totalPostings') {
      return sortOrder === 'asc' ? a.totalPostings - b.totalPostings : b.totalPostings - a.totalPostings;
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const total = filtered.length;
  const startIdx = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(startIdx, startIdx + limitNum);

  res.status(200).json(
    new ApiResponse(
      200,
      paginated,
      'Job postings retrieved successfully',
      {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      }
    )
  );
});

const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = MOCK_JOBS.find((j) => j.id === id);

  if (!job) {
    throw new ApiError(404, `Job with ID '${id}' not found`);
  }

  res.status(200).json(new ApiResponse(200, job, 'Job details retrieved'));
});

const getJobTrends = asyncHandler(async (req, res) => {
  const trends = [
    { month: '2025-07', 'Machine Learning Engineer': 2100, 'Software Engineer': 5600, 'Data Scientist': 2400, 'Cloud Solutions Architect': 1900 },
    { month: '2025-08', 'Machine Learning Engineer': 2250, 'Software Engineer': 5700, 'Data Scientist': 2450, 'Cloud Solutions Architect': 1950 },
    { month: '2025-09', 'Machine Learning Engineer': 2400, 'Software Engineer': 5900, 'Data Scientist': 2520, 'Cloud Solutions Architect': 2040 },
    { month: '2025-10', 'Machine Learning Engineer': 2580, 'Software Engineer': 6050, 'Data Scientist': 2600, 'Cloud Solutions Architect': 2100 },
    { month: '2025-11', 'Machine Learning Engineer': 2700, 'Software Engineer': 6100, 'Data Scientist': 2640, 'Cloud Solutions Architect': 2180 },
    { month: '2025-12', 'Machine Learning Engineer': 2550, 'Software Engineer': 5500, 'Data Scientist': 2500, 'Cloud Solutions Architect': 2050 },
    { month: '2026-01', 'Machine Learning Engineer': 2950, 'Software Engineer': 6350, 'Data Scientist': 2750, 'Cloud Solutions Architect': 2300 },
    { month: '2026-02', 'Machine Learning Engineer': 3120, 'Software Engineer': 6480, 'Data Scientist': 2820, 'Cloud Solutions Architect': 2380 },
    { month: '2026-03', 'Machine Learning Engineer': 3300, 'Software Engineer': 6600, 'Data Scientist': 2910, 'Cloud Solutions Architect': 2450 },
    { month: '2026-04', 'Machine Learning Engineer': 3480, 'Software Engineer': 6750, 'Data Scientist': 2990, 'Cloud Solutions Architect': 2520 },
    { month: '2026-05', 'Machine Learning Engineer': 3650, 'Software Engineer': 6900, 'Data Scientist': 3080, 'Cloud Solutions Architect': 2600 },
    { month: '2026-06', 'Machine Learning Engineer': 3890, 'Software Engineer': 7050, 'Data Scientist': 3180, 'Cloud Solutions Architect': 2680 },
  ];

  res.status(200).json(new ApiResponse(200, trends, 'Job trend history retrieved'));
});

const getJobRoles = asyncHandler(async (req, res) => {
  const roles = [
    'Machine Learning Engineer',
    'Data Scientist',
    'Software Engineer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer',
    'Cloud Solutions Architect',
    'Data Analyst',
    'Cybersecurity Analyst',
    'AI Research Scientist',
    'Mobile App Developer',
    'Product Manager',
    'Database Administrator',
    'QA Automation Engineer',
  ];
  res.status(200).json(new ApiResponse(200, roles, 'Job roles retrieved'));
});

const getJobFilters = asyncHandler(async (req, res) => {
  const filters = {
    locations: ['All', 'Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'London, UK', 'Toronto, Canada', 'Dhaka, Bangladesh'],
    industries: ['All', 'Technology', 'Finance & Banking', 'Healthcare', 'E-commerce & Retail', 'Manufacturing & Telecom', 'Education'],
    experienceLevels: ['All', 'Entry-Level (0-2 yrs)', 'Mid-Level (3-5 yrs)', 'Senior (6-8 yrs)', 'Lead / Principal (9+ yrs)'],
    educationLevels: ['All', "Bachelor's Degree", "Master's Degree", 'PhD / Research Focus', 'Self-Taught / Bootcamp'],
  };
  res.status(200).json(new ApiResponse(200, filters, 'Filter metadata retrieved'));
});

module.exports = {
  getJobs,
  getJobById,
  getJobTrends,
  getJobRoles,
  getJobFilters,
};

