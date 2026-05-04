import fs from 'fs';
import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ORACLEDB_THIN_MODE = 1;

const dbConfig = {
    user: process.env.DB_USER || 'dev',
    password: process.env.DB_PASSWORD || 'dev123',
    connectionString: `${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 1521}/${process.env.DB_SERVICE_NAME || 'XEPDB1'}`
};

(async () => {
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);
        const sql = fs.readFileSync('../../sql/21_fix_don_hang_dates_may2026.sql', 'utf-8');
        const statements = sql.split(';').map(s => s.trim()).filter(s => s && !s.startsWith('--'));
        
        console.log('📁 Executing DON_HANG date fix...\n');
        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i];
            if (!stmt.length) continue;
            console.log(`[${i+1}/${statements.length}] Executing...`);
            const result = await conn.execute(stmt);
            console.log(`✅ Success - Rows affected: ${result.rowsAffected || 'N/A'}\n`);
        }
        await conn.commit();
        console.log('✅ All updates committed!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (conn) await conn.close();
    }
})();
