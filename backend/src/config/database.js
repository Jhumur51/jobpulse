const { PrismaClient } = require('@prisma/client');

let prisma = new PrismaClient({
  log: ['error'],
});

prisma.$isAvailable = false;

// Non-blocking connection check on startup
prisma
  .$connect()
  .then(() => {
    prisma.$isAvailable = true;
    console.log('✅ Connected to PostgreSQL database via Prisma');
  })
  .catch((err) => {
    prisma.$isAvailable = false;
    console.log('ℹ️  PostgreSQL not connected locally; operating with fallback data store');
  });

module.exports = prisma;
