import oracledb from 'oracledb';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

async function insertAdminUsers() {
    let connection;
    try {
        console.log('🔗 Connecting to Oracle Database...');
        const connectionString = `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE_NAME}`;
        
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectionString: connectionString
        });

        console.log('✓ Connected to Oracle Database');

        // Read SQL file
        const sqlPath = path.resolve(__dirname, '../../sql/16_insert_admin_users.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split and execute statements
        const statements = sql.split(';').filter(s => s.trim());
        
        for (const stmt of statements) {
            if (stmt.trim() && !stmt.trim().startsWith('--')) {
                try {
                    const result = await connection.execute(stmt);
                    const preview = stmt.split('\n')[0].substring(0, 60);
                    console.log(`✓ Executed: ${preview}...`);
                } catch (err) {
                    if (!err.message.includes('already exists') && !err.message.includes('ORA-00001')) {
                        console.log(`⚠️ ${err.message}`);
                    }
                }
            }
        }

        // Commit changes
        await connection.commit();
        console.log('✅ Admin users and test customers inserted successfully!');

        // Verify data
        console.log('\n📊 Verifying data:');
        const result = await connection.execute(
            'SELECT MaNguoiDung, HoTen, Email, VaiTro FROM TAI_KHOAN ORDER BY VaiTro DESC',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.table(result.rows);

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('\n🔓 Database connection closed');
            } catch (err) {
                console.error('Error closing connection:', err.message);
            }
        }
    }
}

insertAdminUsers();
