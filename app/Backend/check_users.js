import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

async function checkAdminUsers() {
    let connection;
    try {
        console.log('🔗 Connecting to Oracle Database...');
        const connectionString = `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE_NAME}`;
        
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectionString: connectionString
        });

        console.log('✓ Connected\n');

        // Check all users
        const result = await connection.execute(
            `SELECT MaNguoiDung, HoTen, Email, VaiTro FROM TAI_KHOAN ORDER BY VaiTro DESC, MaNguoiDung`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.log('📊 All Users in System:');
        console.table(result.rows);

        // Count by role
        const roleResult = await connection.execute(
            `SELECT VaiTro, COUNT(*) as Count FROM TAI_KHOAN GROUP BY VaiTro`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.log('\n📈 Users by Role:');
        console.table(roleResult.rows);

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error:', err.message);
            }
        }
    }
}

checkAdminUsers();
