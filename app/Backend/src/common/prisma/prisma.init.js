// Prisma not used - using raw SQL queries with Oracle database
// This file is kept for backward compatibility

const prisma = {
  // Dummy prisma object - actual queries use raw SQL
  $disconnect: async () => {},
};

export default prisma;