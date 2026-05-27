import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ORACLEDB_THIN_MODE = 1;

// Cấu hình kết nối Oracle[cite: 4]
const dbConfig = {
    user: process.env.DB_USER || 'dev',
    password: process.env.DB_PASSWORD || 'dev123',
    connectionString: `${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 1521}/${process.env.DB_SERVICE_NAME || 'XEPDB1'}`,
    poolAlias: 'default', // BẮT BUỘC THÊM DÒNG NÀY
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 2
};

let pool;

/**
 * Khởi tạo Connection Pool
 * Gọi hàm này một lần duy nhất khi khởi động Server (trong server.js)
 */
export async function initialize() {
    try {
        if (!pool) {
            pool = await oracledb.createPool(dbConfig);
            console.log('✓ Oracle Connection Pool initialized');
        }
    } catch (err) {
        console.error('✗ Failed to initialize Oracle Pool:', err.message);
        throw err;
    }
}

/**
 * Xử lý dữ liệu từ Oracle (CLOB, Date, Circular Reference)[cite: 4]
 */
async function cleanOracleData(data) {
    if (!data) return data;
    
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
                    
                    if (value && typeof value === 'object' && value.constructor && 
                        (value.constructor.name === 'Lob' || value.getData)) {
                        try {
                            cleaned[key] = await value.getData ? await value.getData() : '';
                        } catch (e) {
                            cleaned[key] = '';
                        }
                    }
                    else if (value instanceof Date) {
                        cleaned[key] = convertDateToISO(value);
                    }
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
 * Thực hiện truy vấn SELECT[cite: 4]
 */
export async function query(sql, params = []) {
    let connection;
    try {
        // Lấy connection từ pool thay vì tạo mới[cite: 4]
        connection = await oracledb.getConnection();
        connection.lobPrefetchSize = 16384; 
        
        const result = await connection.execute(sql, params, { 
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            fetchAsString: [ oracledb.CLOB ]
        });
        
        return await cleanOracleData(result.rows || []);
    } finally {
        if (connection) {
            // Trả connection về pool[cite: 4]
            await connection.close();
        }
    }
}

/**
 * Thực hiện INSERT, UPDATE, DELETE[cite: 4]
 */
export async function execute(sql, params = []) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(sql, params, { autoCommit: true });
        return result;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

/**
 * Gọi Stored Procedure[cite: 4]
 */
export async function callProcedure(procName, params = []) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`CALL ${procName}`, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return result;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

/**
 * Kiểm tra kết nối[cite: 4]
 */
export async function testConnection() {
    let connection;
    try {
        connection = await oracledb.getConnection();
        await connection.execute('SELECT 1 FROM DUAL');
        console.log('✓ Database connection via Pool successful');
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