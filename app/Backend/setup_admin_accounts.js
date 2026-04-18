import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminAccounts() {
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

        // Update existing admin accounts to Admin role
        console.log('📝 Updating admin accounts to Admin role...');
        const adminEmails = ['admin1@example.com', 'admin2@example.com', 'admin3@example.com'];
        
        for (const email of adminEmails) {
            try {
                await connection.execute(
                    `UPDATE TAI_KHOAN SET VaiTro = 'Admin' WHERE Email = :email`,
                    { email }
                );
                console.log(`  ✓ Updated ${email} to Admin`);
            } catch (err) {
                console.log(`  ⚠️ ${email}: ${err.message}`);
            }
        }

        // Also create one primary admin
        try {
            await connection.execute(
                `INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, Email, MatKhau, VaiTro, SDT, DiaChi, GioiTinh)
                 VALUES ('ADMIN_PRIMARY', 'Quản Trị Viên Chính', 'admin@cinema.vn', 'admin@12345', 'Admin', '0981234567', 'Hà Nội', 'M')`
            );
            console.log('  ✓ Created primary admin account (admin@cinema.vn)');
        } catch (err) {
            if (err.errorNum === 1) {
                console.log('  ℹ️ Primary admin already exists');
            }
        }

        await connection.commit();
        console.log('\n✅ Admin accounts updated!\n');

        // Show statistics
        const result = await connection.execute(
            `SELECT VaiTro, COUNT(*) as Count FROM TAI_KHOAN GROUP BY VaiTro ORDER BY VaiTro DESC`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.log('📊 User Statistics:');
        console.table(result.rows);

        // Show admin users
        const admins = await connection.execute(
            `SELECT MaNguoiDung, HoTen, Email FROM TAI_KHOAN WHERE VaiTro = 'Admin' ORDER BY MaNguoiDung`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.log('\n👨‍💼 Admin Accounts:');
        console.table(admins.rows);

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

createAdminAccounts();
