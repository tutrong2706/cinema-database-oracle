import { initialize, query } from './src/config/database.js';

async function testMovies() {
    try {
        // Bắt buộc khởi tạo Pool
        await initialize();

        console.log('🔍 Testing movie data...\n');
        
        // 1. Kiểm tra bảng PHIM (Đã sửa từ TRAPHIM)
        const countResult = await query('SELECT COUNT(*) as TOTAL FROM PHIM');
        console.log('✅ Total movies in DB:', countResult[0]?.TOTAL || 0);
        
        // 2. Kiểm tra bảng RAP_CHIEU_PHIM (Đã sửa từ RAP_PHIM)
        console.log('\n---\n');
        const cinemas = await query('SELECT COUNT(*) as TOTAL FROM RAP_CHIEU_PHIM');
        console.log('✅ Total cinemas in DB:', cinemas[0]?.TOTAL || 0);
        
        // 3. Kiểm tra bảng MAT_HANG (Đã sửa từ HANG_HANG)
        const combos = await query('SELECT COUNT(*) as TOTAL FROM MAT_HANG');
        console.log('✅ Total combos in DB:', combos[0]?.TOTAL || 0);
        
        // 4. Kiểm tra bảng SUAT_CHIEU
        const screenings = await query('SELECT COUNT(*) as TOTAL FROM SUAT_CHIEU');
        console.log('✅ Total screenings in DB:', screenings[0]?.TOTAL || 0);
        
        // 5. Kiểm tra bảng TAI_KHOAN
        console.log('\n---\n');
        const users = await query('SELECT COUNT(*) as TOTAL FROM TAI_KHOAN');
        console.log('✅ Total users in DB:', users[0]?.TOTAL || 0);
        
        // 6. Kiểm tra bảng DON_HANG
        console.log('\n---\n');
        const orders = await query('SELECT COUNT(*) as TOTAL FROM DON_HANG');
        console.log('✅ Total orders in DB:', orders[0]?.TOTAL || 0);
        
        console.log('\n✅ Database test complete!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testMovies();