import { query } from './src/config/database.js';

async function testMovies() {
    try {
        console.log('🔍 Testing movie data...\n');
        
        // Test 1: Count all movies
        const countResult = await query('SELECT COUNT(*) as TOTAL FROM TRAPHIM');
        console.log('✅ Total movies in DB:', countResult[0]?.TOTAL || 0);
        
        // Test 2: Get first 5 movies
        const movies = await query(`
            SELECT MaPhim, TenPhim, ThoiLuong, NgayKhoiChieu, DiemDanhGia
            FROM TRAPHIM
            WHERE ROWNUM <= 5
        `);
        
        if (movies.length > 0) {
            console.log('\n✅ Sample movies:');
            movies.forEach(m => {
                console.log(`  - ${m.MAPHIM}: ${m.TENPHIM} (${m.THOILUONG}p, Rating: ${m.DIEMDANHGIA})`);
            });
        } else {
            console.log('\n❌ No movies found in database!');
        }
        
        // Test 3: Check cinemas
        console.log('\n---\n');
        const cinemas = await query('SELECT COUNT(*) as TOTAL FROM RAP_PHIM');
        console.log('✅ Total cinemas in DB:', cinemas[0]?.TOTAL || 0);
        
        // Test 4: Check combos
        const combos = await query('SELECT COUNT(*) as TOTAL FROM HANG_HANG');
        console.log('✅ Total combos in DB:', combos[0]?.TOTAL || 0);
        
        // Test 5: Check screenings
        const screenings = await query('SELECT COUNT(*) as TOTAL FROM SUAT_CHIEU');
        console.log('✅ Total screenings in DB:', screenings[0]?.TOTAL || 0);
        
        // Test 6: Check users
        console.log('\n---\n');
        const users = await query('SELECT COUNT(*) as TOTAL FROM TAI_KHOAN');
        console.log('✅ Total users in DB:', users[0]?.TOTAL || 0);
        
        const admins = await query("SELECT COUNT(*) as TOTAL FROM TAI_KHOAN WHERE VaiTro = 'Admin'");
        console.log('✅ Total admin users:', admins[0]?.TOTAL || 0);
        
        const customers = await query("SELECT COUNT(*) as TOTAL FROM TAI_KHOAN WHERE VaiTro = 'Khach'");
        console.log('✅ Total customer users:', customers[0]?.TOTAL || 0);
        
        // Test 7: Check orders
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
