import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Play,
  Eye,
  Database,
  Layers,
  Calendar,
  X,
  FileText,
  Download,
  RefreshCw,
} from 'lucide-react';
import { datasetService } from '../../services/dataset.service';
import { Dataset } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { PageHeader } from '../../components/common/PageHeader';
import { downloadCsv } from '../../utils/export';

export const DatasetsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [description, setDescription] = useState('');
  const [previewDataset, setPreviewDataset] = useState<Dataset | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch datasets
  const { data: datasets, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['datasets-list'],
    queryFn: datasetService.getDatasets,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => datasetService.uploadDataset(formData),
    onSuccess: (newDataset) => {
      queryClient.invalidateQueries({ queryKey: ['datasets-list'] });
      setSelectedFile(null);
      setDatasetName('');
      setDescription('');
      setSuccessMsg(`Dataset '${newDataset.name}' uploaded and validated successfully!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => datasetService.deleteDataset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets-list'] });
      setDeleteConfirmId(null);
      setSuccessMsg('Dataset successfully removed.');
      setTimeout(() => setSuccessMsg(null), 4000);
    },
  });

  // Import mutation
  const importMutation = useMutation({
    mutationFn: (id: string) => datasetService.importDataset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      setSuccessMsg('Dataset successfully imported and synchronized with feature store!');
      setTimeout(() => setSuccessMsg(null), 4000);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!datasetName) {
        setDatasetName(file.name.replace(/\.csv$/i, ''));
      }
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', datasetName);
    formData.append('description', description);

    uploadMutation.mutate(formData);
  };

  const handleDownloadSampleCsv = () => {
    const headers = [
      'jobTitle',
      'company',
      'location',
      'industry',
      'experience',
      'education',
      'postingDate',
      'skills',
      'salary',
    ];
    const rows = [
      [
        'Machine Learning Engineer',
        'DeepScale AI',
        'San Francisco, CA',
        'Technology',
        'Senior',
        "Master's Degree",
        '2026-03-01',
        'Python; PyTorch; Docker; MLOps; Transformers',
        '$175,000 - $210,000',
      ],
      [
        'Data Scientist',
        'Quantum Health',
        'Boston, MA',
        'Healthcare',
        'Mid-Level',
        "Bachelor's Degree",
        '2026-03-05',
        'Python; SQL; Scikit-learn; Pandas; R',
        '$130,000 - $160,000',
      ],
      [
        'Cloud Solutions Architect',
        'FinApex Cloud',
        'New York, NY',
        'Finance',
        'Senior',
        "Bachelor's Degree",
        '2026-03-08',
        'AWS; Terraform; Kubernetes; Python; Microservices',
        '$180,000 - $220,000',
      ],
      [
        'Full Stack Developer',
        'Nexora Systems',
        'Austin, TX',
        'Technology',
        'Mid-Level',
        "Bachelor's Degree",
        '2026-03-12',
        'React; Node.js; TypeScript; PostgreSQL; TailwindCSS',
        '$125,000 - $150,000',
      ],
      [
        'Cybersecurity Analyst',
        'Sentinel Guard',
        'Washington, DC',
        'Technology',
        'Senior',
        "Bachelor's Degree",
        '2026-03-15',
        'Network Security; SIEM; Incident Response; Python; Linux',
        '$140,000 - $170,000',
      ],
    ];
    downloadCsv('jobpulse_sample_dataset_template', headers, rows);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dataset Management"
        description="View sample job datasets or upload custom CSV files for analysis."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSampleCsv}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Sample CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              isLoading={isFetching}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* CSV Upload Dropzone Card */}
      <Card>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-navy-900 dark:text-white">
              Upload Historical Job Posting Dataset (.csv)
            </h3>
          </div>
          <button
            onClick={handleDownloadSampleCsv}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <Download className="w-3 h-3" /> Get CSV Template
          </button>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-border-light dark:border-border-dark rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer relative bg-slate-50/50 dark:bg-slate-900/30">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <FileSpreadsheet className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sm font-semibold text-navy-900 dark:text-white">
              {selectedFile ? selectedFile.name : 'Drag and drop your CSV file here, or browse'}
            </p>
            <p className="text-xs text-text-muted mt-1">
              Supports CSV up to 25MB. Must contain job title, location, posting date, and skills.
            </p>
          </div>

          {selectedFile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-text-main dark:text-text-darkMain mb-1">
                  Dataset Name
                </label>
                <input
                  type="text"
                  required
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main dark:text-text-darkMain mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Bangladesh Tech Job Postings 2024-2026"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isLoading={uploadMutation.isPending}
                  leftIcon={<UploadCloud className="w-4 h-4" />}
                >
                  Upload & Validate
                </Button>
              </div>
            </div>
          )}
        </form>
      </Card>

      {/* Datasets Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-navy-900 dark:text-white">
              Indexed Datasets
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Available data sources feeding into the ML preprocessing pipeline
            </p>
          </div>
          <Badge variant="primary">{datasets?.length || 0} Total</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-border-light dark:border-border-dark text-text-muted dark:text-text-darkMuted uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Dataset Name</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Records</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : (
                (datasets || []).map((ds) => (
                  <tr
                    key={ds.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-text-main dark:text-text-darkMain">
                        {ds.name}
                      </div>
                      {ds.description && (
                        <div className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                          {ds.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={ds.isDemo ? 'warning' : 'neutral'} size="sm">
                        {ds.isDemo ? 'Benchmark Demo' : ds.source}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-navy-900 dark:text-white">
                      {ds.recordCount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success" size="sm">
                        {ds.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-text-muted">
                      {new Date(ds.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewDataset(ds)}
                          title="Preview Dataset Columns"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => importMutation.mutate(ds.id)}
                          title="Sync into ML Feature Store"
                        >
                          <Play className="w-3.5 h-3.5 text-emerald-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(ds.id)}
                          className="hover:text-danger"
                          title="Delete Dataset"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Preview Modal */}
      {previewDataset && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card-dark rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-border-light dark:border-border-dark space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
              <h3 className="font-bold text-base text-navy-900 dark:text-white">
                Dataset Inspection: {previewDataset.name}
              </h3>
              <button
                onClick={() => setPreviewDataset(null)}
                className="p-1 rounded-lg text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-text-muted">{previewDataset.description}</p>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Records:</span>
                  <span className="font-mono">{previewDataset.recordCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Data Source:</span>
                  <span>{previewDataset.source}</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Supported Feature Fields</h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'jobTitle',
                    'location',
                    'industry',
                    'experience',
                    'education',
                    'postingDate',
                    'skills',
                    'salary',
                  ].map((field) => (
                    <Badge key={field} variant="neutral" size="sm">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-light dark:border-border-dark flex justify-end">
              <Button size="sm" onClick={() => setPreviewDataset(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card-dark rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border-light dark:border-border-dark space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-danger flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-navy-900 dark:text-white">
                Delete Dataset?
              </h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Are you sure you want to delete this dataset? This will remove all associated job postings and feature mappings permanently.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
