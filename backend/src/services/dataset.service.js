const fs = require('fs');
const path = require('path');
const readline = require('readline');
const prisma = require('../config/database');
const ApiError = require('../utils/ApiError');

// Memory store for datasets when database is in transition
let inMemoryDatasets = [
  {
    id: 'demo-dataset-2026',
    name: 'Global Tech Job Postings Benchmark (2021-2026)',
    description: 'Historical longitudinal records of software, data science, and cloud jobs across 11 key regions.',
    source: 'BENCHMARK_RESEARCH',
    recordCount: 353200,
    status: 'READY',
    isDemo: true,
    createdAt: new Date('2026-01-15T00:00:00Z'),
  },
  {
    id: 'demo-dataset-ai',
    name: 'Emerging AI & MLOps Market Demand Sample',
    description: 'Targeted survey of GenAI, LLM engineer, and data infrastructure postings.',
    source: 'RESEARCH_SURVEY',
    recordCount: 24800,
    status: 'READY',
    isDemo: true,
    createdAt: new Date('2026-03-20T00:00:00Z'),
  },
];

class DatasetService {
  async listDatasets() {
    if (prisma && prisma.$isAvailable) {
      try {
        const dbDatasets = await prisma.dataset.findMany({
          orderBy: { createdAt: 'desc' },
        });
        if (dbDatasets.length > 0) return dbDatasets;
      } catch (err) {}
    }
    return inMemoryDatasets;
  }

  async getDatasetById(id) {
    if (prisma && prisma.dataset) {
      try {
        const dataset = await prisma.dataset.findUnique({
          where: { id },
          include: { imports: true },
        });
        if (dataset) return dataset;
      } catch (err) {}
    }
    const found = inMemoryDatasets.find((d) => d.id === id);
    if (!found) {
      throw new ApiError(404, `Dataset with ID '${id}' not found`);
    }
    return found;
  }

  async parseAndValidateCSV(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let headers = [];
    let rowCount = 0;
    const previewRows = [];
    const missingValueCounts = {};
    const seenSignatures = new Set();
    let duplicateCount = 0;

    for await (const line of rl) {
      if (!line.trim()) continue;
      const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));

      if (rowCount === 0) {
        headers = cols;
        headers.forEach((h) => {
          missingValueCounts[h] = 0;
        });
      } else {
        const rowObj = {};
        let signature = '';

        headers.forEach((h, idx) => {
          const val = cols[idx] || '';
          rowObj[h] = val;
          if (!val) missingValueCounts[h]++;
          signature += `${val}|`;
        });

        if (seenSignatures.has(signature)) {
          duplicateCount++;
        } else {
          seenSignatures.add(signature);
        }

        if (previewRows.length < 10) {
          previewRows.push(rowObj);
        }
      }
      rowCount++;
    }

    const dataRowsCount = Math.max(0, rowCount - 1);

    return {
      headers,
      totalRows: dataRowsCount,
      preview: previewRows,
      missingStats: missingValueCounts,
      duplicateCount,
      isValid: headers.length >= 3,
    };
  }

  async createDataset({ name, description, filePath, userId, isDemo = false }) {
    const analysis = await this.parseAndValidateCSV(filePath);

    const newDataset = {
      id: 'ds-' + Date.now(),
      name,
      description: description || 'User uploaded job postings dataset',
      source: 'CSV_UPLOAD',
      recordCount: analysis.totalRows,
      status: 'READY',
      isDemo: Boolean(isDemo),
      uploadedBy: userId,
      createdAt: new Date(),
      analysis,
    };

    if (prisma && prisma.dataset) {
      try {
        const created = await prisma.dataset.create({
          data: {
            name: newDataset.name,
            description: newDataset.description,
            source: newDataset.source,
            recordCount: newDataset.recordCount,
            status: newDataset.status,
            isDemo: newDataset.isDemo,
            uploadedBy: userId,
          },
        });
        return { ...created, analysis };
      } catch (err) {}
    }

    inMemoryDatasets.unshift(newDataset);
    return newDataset;
  }

  async deleteDataset(id) {
    if (prisma && prisma.dataset) {
      try {
        await prisma.dataset.delete({ where: { id } });
        return true;
      } catch (err) {}
    }

    const initialLen = inMemoryDatasets.length;
    inMemoryDatasets = inMemoryDatasets.filter((d) => d.id !== id);
    if (inMemoryDatasets.length === initialLen) {
      throw new ApiError(404, `Dataset with ID '${id}' not found`);
    }
    return true;
  }
}

module.exports = new DatasetService();
