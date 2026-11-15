import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
  Building,
  Briefcase,
  Download,
  RotateCcw,
  Eye,
  X,
  GraduationCap,
  DollarSign,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { jobsService } from '../../services/jobs.service';
import { JobPosting } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { PageHeader } from '../../components/common/PageHeader';
import { downloadCsv } from '../../utils/export';

export const JobTrendsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [sortBy, setSortBy] = useState('postingDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  // Fetch filters
  const { data: filters } = useQuery({
    queryKey: ['job-filters'],
    queryFn: jobsService.getJobFilters,
  });

  // Fetch historical trends
  const { data: trendData, isLoading: loadingTrends } = useQuery({
    queryKey: ['job-trends-history'],
    queryFn: jobsService.getJobTrends,
  });

  // Fetch paginated jobs
  const { data: jobsResponse, isLoading: loadingJobs } = useQuery({
    queryKey: [
      'jobs-list',
      page,
      search,
      selectedLocation,
      selectedIndustry,
      selectedExperience,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      jobsService.getJobs({
        page,
        limit: 8,
        search,
        location: selectedLocation,
        industry: selectedIndustry,
        experience: selectedExperience,
        sortBy,
        sortOrder,
      }),
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedLocation('All');
    setSelectedIndustry('All');
    setSelectedExperience('All');
    setPage(1);
  };

  const isFiltered =
    Boolean(search.trim()) ||
    selectedLocation !== 'All' ||
    selectedIndustry !== 'All' ||
    selectedExperience !== 'All';

  const jobs = jobsResponse?.data || [];
  const pagination = jobsResponse?.pagination || { page: 1, totalPages: 1, total: 0 };

  const handleExportCsv = () => {
    const headers = [
      'Job Title',
      'Company',
      'Postings Volume',
      'Location',
      'Industry',
      'Experience Level',
      'Education Required',
      'Salary',
      'Posting Date',
      'Skills',
    ];
    const rows = jobs.map((j) => [
      j.jobTitle,
      j.company,
      j.totalPostings || 1,
      j.location,
      j.industry,
      j.experience || 'Flexible',
      j.education || 'Degree preferred',
      j.salary || 'Market Rate',
      j.postingDate,
      (j.skills || []).join('; '),
    ]);
    downloadCsv(`jobpulse_job_trends_page_${page}`, headers, rows);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Roles & Hiring Trends"
        description="Browse, filter, and compare job postings across different tech roles and locations."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export Current Table (CSV)
            </Button>
          </div>
        }
      />

      {/* Historical Demand Comparison Chart */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-navy-900 dark:text-white">
              Role Demand Comparison Trajectory
            </h3>
            <p className="text-xs text-text-muted dark:text-text-darkMuted mt-0.5">
              Comparative monthly posting volume across benchmark tech disciplines
            </p>
          </div>
          <Badge variant="primary">Multi-Role Series</Badge>
        </div>

        <div className="h-72 w-full">
          {loadingTrends ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData || []} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="Machine Learning Engineer"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Software Engineer"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Data Scientist"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Cloud Solutions Architect"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search title, company, skill..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Location filter */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-main dark:text-text-darkMain"
            >
              <option value="All">All Locations</option>
              {filters?.locations?.filter((l) => l !== 'All').map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Industry filter */}
          <div>
            <select
              value={selectedIndustry}
              onChange={(e) => {
                setSelectedIndustry(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-main dark:text-text-darkMain"
            >
              <option value="All">All Industries</option>
              {filters?.industries?.filter((i) => i !== 'All').map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Experience filter */}
          <div>
            <select
              value={selectedExperience}
              onChange={(e) => {
                setSelectedExperience(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-main dark:text-text-darkMain"
            >
              <option value="All">All Experience</option>
              {filters?.experienceLevels?.filter((exp) => exp !== 'All').map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters bar if filter active */}
        {isFiltered && (
          <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark flex items-center justify-between text-xs">
            <span className="text-text-muted">
              Active filters applied. Showing filtered results.
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-primary hover:text-primary-700"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Table Section */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-border-light dark:border-border-dark text-text-muted dark:text-text-darkMuted uppercase font-semibold">
              <tr>
                <th
                  onClick={() => handleSort('jobTitle')}
                  className="py-3.5 px-4 cursor-pointer hover:text-text-main select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Job Title <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('totalPostings')}
                  className="py-3.5 px-4 cursor-pointer hover:text-text-main select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Volume <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Industry</th>
                <th className="py-3.5 px-4">Experience</th>
                <th
                  onClick={() => handleSort('postingDate')}
                  className="py-3.5 px-4 cursor-pointer hover:text-text-main select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Latest Date <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {loadingJobs ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="py-4 px-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    No job postings found matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-text-main dark:text-text-darkMain">
                        {job.jobTitle}
                      </div>
                      <div className="text-[11px] text-text-muted dark:text-text-darkMuted flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3" /> {job.company}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-navy-900 dark:text-white">
                      {job.totalPostings ? job.totalPostings.toLocaleString() : '1'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-text-muted dark:text-text-darkMuted">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="neutral" size="sm">
                        {job.industry}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-text-muted dark:text-text-darkMuted">
                      {job.experience || 'Flexible'}
                    </td>
                    <td className="py-3 px-4 font-mono text-text-muted dark:text-text-darkMuted">
                      {job.postingDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                        }}
                        title="View Full Posting Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="py-3 px-4 border-t border-border-light dark:border-border-dark flex items-center justify-between text-xs">
          <span className="text-text-muted dark:text-text-darkMuted">
            Showing Page <span className="font-semibold">{pagination.page}</span> of{' '}
            <span className="font-semibold">{pagination.totalPages}</span> ({pagination.total} records)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card-dark rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border-light dark:border-border-dark space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-border-light dark:border-border-dark">
              <div>
                <h3 className="font-bold text-lg text-navy-900 dark:text-white">
                  {selectedJob.jobTitle}
                </h3>
                <p className="text-xs text-text-muted flex items-center gap-1.5 mt-1">
                  <Building className="w-3.5 h-3.5" /> {selectedJob.company} •{' '}
                  <MapPin className="w-3.5 h-3.5" /> {selectedJob.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-1">
                <span className="text-text-muted block">Industry Sector</span>
                <span className="font-semibold text-text-main dark:text-text-darkMain">
                  {selectedJob.industry}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-1">
                <span className="text-text-muted block">Experience Bracket</span>
                <span className="font-semibold text-text-main dark:text-text-darkMain">
                  {selectedJob.experience || 'Flexible / Mid-Level'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-1">
                <span className="text-text-muted block">Education Requirement</span>
                <span className="font-semibold text-text-main dark:text-text-darkMain">
                  {selectedJob.education || "Bachelor's Degree in CS/Data"}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-1">
                <span className="text-text-muted block">Estimated Comp Range</span>
                <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedJob.salary || '$110,000 - $165,000 / yr'}
                </span>
              </div>
            </div>

            {/* Skills Tagged */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Required Skills & Tooling
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedJob.skills && selectedJob.skills.length > 0
                  ? selectedJob.skills
                  : ['Python', 'SQL', 'Git', 'Agile']
                ).map((s) => (
                  <Badge key={s} variant="primary" size="sm">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between text-xs">
              <span className="text-text-muted font-mono">
                Posting Date: {selectedJob.postingDate}
              </span>
              <Button size="sm" onClick={() => setSelectedJob(null)}>
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
