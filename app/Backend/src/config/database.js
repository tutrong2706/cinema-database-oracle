import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ORACLEDB_THIN_MODE = 1;

// Cấu hình kết nối Oracle
const dbConfig = {
    user: process.env.DB_USER || 'dev',
    password: process.env.DB_PASSWORD || 'dev123',
    connectionString: `${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 1521}/${process.env.DB_SERVICE_NAME || 'XEPDB1'}`
};

/**
 * Xử lý circular reference từ Oracle driver
 * Chỉ lấy các property cần thiết, bỏ qua circular references
 * Đặc biệt xử lý Lob objects (CLOB) và Date/Timestamp objects
 * @param {Array|Object} data - Dữ liệu từ database
 * @returns {Promise<Array|Object>} - Dữ liệu clean
 */
async function cleanOracleData(data) {
    if (!data) return data;
    
    // Helper function to convert Date to ISO string
    const convertDateToISO = (dateValue) => {
        if (!dateValue) return null;
        if (dateValue instanceof Date) {
            return dateValue.toISOString();
        }
        return dateValue;
    };
    
    if (Array.isArray(data)) {
        const promises = data.map(async row => {
            if (row && typeof row === 'object') {
                const cleaned = {};
                for (const key in row) {
                    const value = row[key];
                    const valueType = typeof value;
                    
                    // ✅ Handle Lob objects (CLOB/BLOB)
                    if (value && typeof value === 'object' && value.constructor && 
                        (value.constructor.name === 'Lob' || value.getData)) {
                        try {
                            // Fetch CLOB data as string
                            cleaned[key] = await value.getData ? await value.getData() : '';
                        } catch (e) {
                            console.warn(`⚠️ Failed to fetch CLOB for ${key}:`, e.message);
                            cleaned[key] = '';
                        }
                    }
                    // ✅ Handle Date/Timestamp objects
                    else if (value instanceof Date) {
                        cleaned[key] = convertDateToISO(value);
                    }
                    // Chỉ lấy primitive types hoặc null/undefined
                    else if (valueType === 'string' || valueType === 'number' || valueType === 'boolean' ||
                        value === null || value === undefined) {
                        cleaned[key] = value;
                    }
                }
                return cleaned;
            }
            return row;
        });
        
        return await Promise.all(promises);
    }
    
    return data;
}

/**
 * Thực hiện query SELECT và trả về kết quả
 * @param {string} sql - Câu SQL
 * @param {Array} params - Tham số bind
 * @returns {Promise<Array>}
 */
export async function query(sql, params = []) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        // ✅ Cấu hình cho CLOB columns
        connection.lobPrefetchSize = 16384; // 16KB prefetch for CLOB
        
        const result = await connection.execute(sql, params, { 
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            fetchAsString: [ oracledb.CLOB ]  // Attempt to fetch CLOB as string
        });
        
        // ✅ Clean circular reference & fetch Lob data
        const cleaned = await cleanOracleData(result.rows || []);
        
        return cleaned;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

/**
 * Thực hiện INSERT, UPDATE, DELETE
 * @param {string} sql - Câu SQL
 * @param {Array} params - Tham số bind
 * @returns {Promise<Object>} - Kết quả execute
 */
export async function execute(sql, params = []) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(sql, params, { autoCommit: true });
        return result;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

/**
 * Gọi Stored Procedure
 * @param {string} procName - Tên procedure
 * @param {Array} params - Tham số
 * @returns {Promise<Array>} - Kết quả
 */
export async function callProcedure(procName, params = []) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(`CALL ${procName}`, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return result;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

/**
 * Kiểm tra kết nối database
 * @returns {Promise<boolean>}
 */
export async function testConnection() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT 1 FROM DUAL');
        console.log('✓ Database connection successful');
        return true;
    } catch (error) {
        console.error('✗ Database connection failed:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}
