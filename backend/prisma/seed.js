const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting JobPulse database seeding...');

  // 1. Seed Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@jobpulse.ai' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@jobpulse.ai',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'user@jobpulse.ai' },
    update: {},
    create: {
      name: 'Senior Market Researcher',
      email: 'user@jobpulse.ai',
      passwordHash: userPassword,
      role: 'USER',
    },
  });

  console.log(`✅ Seeded users: ${admin.email}, ${demoUser.email}`);

  // 2. Seed Skills
  const skillsData = [
    { name: 'Python', category: 'PROGRAMMING' },
    { name: 'TypeScript', category: 'PROGRAMMING' },
    { name: 'Rust', category: 'PROGRAMMING' },
    { name: 'Go (Golang)', category: 'PROGRAMMING' },
    { name: 'Java', category: 'PROGRAMMING' },
    { name: 'SQL', category: 'DATA_AND_ANALYTICS' },
    { name: 'Apache Spark', category: 'DATA_AND_ANALYTICS' },
    { name: 'Snowflake / BigQuery', category: 'DATA_AND_ANALYTICS' },
    { name: 'Tableau', category: 'DATA_AND_ANALYTICS' },
    { name: 'Large Language Models (LLMs)', category: 'AI_AND_MACHINE_LEARNING' },
    { name: 'PyTorch', category: 'AI_AND_MACHINE_LEARNING' },
    { name: 'Vector Databases (RAG)', category: 'AI_AND_MACHINE_LEARNING' },
    { name: 'Scikit-Learn', category: 'AI_AND_MACHINE_LEARNING' },
    { name: 'React.js', category: 'WEB_DEVELOPMENT' },
    { name: 'Next.js', category: 'WEB_DEVELOPMENT' },
    { name: 'Node.js', category: 'WEB_DEVELOPMENT' },
    { name: 'Kubernetes', category: 'CLOUD_AND_DEVOPS' },
    { name: 'Docker', category: 'CLOUD_AND_DEVOPS' },
    { name: 'Terraform', category: 'CLOUD_AND_DEVOPS' },
    { name: 'Amazon Web Services (AWS)', category: 'CLOUD_AND_DEVOPS' },
    { name: 'Zero Trust Architecture', category: 'CYBERSECURITY' },
    { name: 'SIEM & SOC Operations', category: 'CYBERSECURITY' },
    { name: 'Agile / Scrum Leadership', category: 'BUSINESS_AND_SOFT_SKILLS' },
    { name: 'Cross-Functional Collaboration', category: 'BUSINESS_AND_SOFT_SKILLS' },
  ];

  for (const sk of skillsData) {
    await prisma.skill.upsert({
      where: { name: sk.name },
      update: {},
      create: sk,
    });
  }
  console.log(`✅ Seeded ${skillsData.length} core skills`);

  // 3. Seed Benchmark Dataset
  const benchmarkDataset = await prisma.dataset.upsert({
    where: { id: 'demo-dataset-2026' },
    update: {},
    create: {
      id: 'demo-dataset-2026',
      name: 'Global Tech Job Postings Benchmark (2021-2026)',
      description: 'Longitudinal aggregated dataset covering 353,200 postings across major technology centers.',
      source: 'BENCHMARK_RESEARCH',
      recordCount: 353200,
      status: 'READY',
      isDemo: true,
      uploadedBy: admin.id,
    },
  });

  // 4. Seed Model Evaluations
  const evaluations = [
    {
      modelName: 'Gradient Boosting Regressor',
      mae: 91.66,
      mse: 18371.51,
      rmse: 135.54,
      mape: 5.75,
      r2: 0.9867,
      datasetId: benchmarkDataset.id,
    },
    {
      modelName: 'Random Forest Regressor',
      mae: 104.22,
      mse: 21940.18,
      rmse: 148.12,
      mape: 6.42,
      r2: 0.9841,
      datasetId: benchmarkDataset.id,
    },
    {
      modelName: 'Ridge Regressor',
      mae: 168.45,
      mse: 46210.33,
      rmse: 214.96,
      mape: 11.20,
      r2: 0.9665,
      datasetId: benchmarkDataset.id,
    },
    {
      modelName: 'Linear Trend Model',
      mae: 198.80,
      mse: 62450.12,
      rmse: 249.90,
      mape: 13.85,
      r2: 0.9548,
      datasetId: benchmarkDataset.id,
    },
  ];

  for (const ev of evaluations) {
    await prisma.modelEvaluation.create({ data: ev });
  }
  console.log(`✅ Seeded ${evaluations.length} model evaluations`);

  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

