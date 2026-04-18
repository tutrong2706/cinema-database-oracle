import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

async function addVaiTroColumn() {
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

        // Check if VaiTro column already exists
        try {
            const checkResult = await connection.execute(`
                SELECT COLUMN_NAME FROM USER_TAB_COLUMNS 
                WHERE TABLE_NAME = 'TAI_KHOAN' AND COLUMN_NAME = 'VAITRO'
            `);

            if (checkResult.rows && checkResult.rows.length > 0) {
                console.log('✓ VaiTro column already exists in TAI_KHOAN table');
                return;
            }
        } catch (err) {
            console.log('⚠️ Error checking column:', err.message);
        }

        // Add VaiTro column
        console.log('📝 Adding VaiTro column to TAI_KHOAN table...');
        await connection.execute(`
            ALTER TABLE TAI_KHOAN ADD (VaiTro VARCHAR2(20) DEFAULT 'Khach')
        `);
        console.log('✓ VaiTro column added successfully');

        // Add constraint
        console.log('📝 Adding constraint to VaiTro column...');
        try {
            await connection.execute(`
                ALTER TABLE TAI_KHOAN ADD CONSTRAINT chk_tk_vaitro CHECK (VaiTro IN ('Khach', 'Admin'))
            `);
            console.log('✓ Constraint added successfully');
        } catch (err) {
            if (err.errorNum === 2260) {
                console.log('✓ Constraint already exists');
            } else {
                throw err;
            }
        }

        // Commit changes
        await connection.commit();
        console.log('✅ VaiTro column successfully added to TAI_KHOAN table!');

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('🔓 Database connection closed');
            } catch (err) {
                console.error('Error closing connection:', err.message);
            }
        }
    }
}

addVaiTroColumn();
