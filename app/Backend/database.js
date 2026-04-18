import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

// ✅ QUAN TRỌNG: Khởi tạo Oracle Client
try {
  oracledb.initOracleClient();
  console.log("✅ Oracle Client initialized");
} catch (err) {
  console.error("⚠️ Oracle Client init warning:", err.message);
}

const dbConfig = {
  user: process.env.DB_USER || "dev",
  password: process.env.DB_PASSWORD || "dev123",
  connectionString: `${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 1521}/${process.env.DB_SERVICE_NAME || "XEPDB1"}`
};

console.log("🔌 Connecting to:", dbConfig.connectionString);

// Normalize column names to UPPERCASE
function normalizeRow(row) {
  if (!row || typeof row !== 'object') return row;
  const normalized = {};
  for (const key in row) {
    normalized[key.toUpperCase()] = row[key];
  }
  return normalized;
}

function normalizeRows(rows) {
  if (!Array.isArray(rows)) return rows;
  return rows.map(normalizeRow);
}

export async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    // Enable CLOB fetching
    connection.lobPrefetchSize = 16384; // 16KB prefetch for CLOB
    console.log("✅ Database connected!");
    return connection;
  } catch (err) {
    console.error("❌ Connection Error:", err.message);
    throw err;
  }
}

export async function query(sql, params = []) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(sql, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      fetchAsString: [ oracledb.CLOB ]  // Fetch CLOB as string
    });
    const normalized = normalizeRows(result.rows || []);
    
    // Debug log
    if (normalized.length > 0 && sql.includes('WHERE MaPhim')) {
      console.log('🔍 Raw result:', result.rows[0]);
      console.log('🔍 Normalized result:', normalized[0]);
    }
    
    return normalized;
  } finally {
    if (connection) await connection.close();
  }
}

export async function execute(sql, params = []) {
  let connection;
  try {
    connection = await getConnection();
    return await connection.execute(sql, params, { autoCommit: true });
  } finally {
    if (connection) await connection.close();
  }
}

export async function testConnection() {
  try {
    const connection = await getConnection();
    const result = await connection.execute(`SELECT COUNT(*) as cnt FROM PHIM`);
    console.log(`✅ OK, Phim: ${result.rows[0][0]}`);
    await connection.close();
  } catch (err) {
    console.error("❌ Test failed:", err.message);
    throw err;
  }
}
