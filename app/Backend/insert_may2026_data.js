import fs from 'fs';
import path from 'path';
import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ORACLEDB_THIN_MODE = 1;

const dbConfig = {
    user: process.env.DB_USER || 'dev',
    password: process.env.DB_PASSWORD || 'dev123',
    connectionString: `${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 1521}/${process.env.DB_SERVICE_NAME || 'XEPDB1'}`
};

async function executeSQL(sqlFilePath) {
    let connection;
    try {
        console.log('🔍 Connecting to Oracle Database...');
        connection = await oracledb.getConnection(dbConfig);
        console.log('✅ Connected to Oracle!');

        const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
        
        // Split by semicolons but be careful with quotes
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt && !stmt.startsWith('--') && !stmt.startsWith('/*'));

        console.log(`📊 Found ${statements.length} SQL statements\n`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (!statement.length) continue;

            try {
                console.log(`[${i + 1}/${statements.length}] Executing...`);
                const result = await connection.execute(statement);
                console.log(`✅ Success - Rows affected: ${result.rowsAffected || 'N/A'}\n`);
            } catch (error) {
                console.error(`❌ Error in statement ${i + 1}:`);
                console.error('Statement:', statement.substring(0, 100) + '...');
                console.error('Error:', error.message);
                throw error;
            }
        }

        await connection.commit();
        console.log('\n✅ All statements executed and committed successfully!');
    } catch (error) {
        console.error('❌ Fatal Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.close();
            console.log('🔌 Database connection closed');
        }
    }
}

// Execute the May 2026 test data script
const testDataPath = path.join('..', '..', 'sql', '20_may_2026_test_data.sql');
console.log(`📁 Loading SQL file: ${testDataPath}\n`);
executeSQL(testDataPath);
