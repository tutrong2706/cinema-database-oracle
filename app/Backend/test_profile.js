import { query } from './src/config/database.js';

try {
    console.log('🔍 Testing profile data...\n');
    
    // Get sample admin account
    const admins = await query(`
        SELECT MaNguoiDung, HoTen, Email, SDT, DiaChi, VaiTro, GioiTinh 
        FROM TAI_KHOAN 
        WHERE VaiTro = 'Admin' AND ROWNUM <= 1
    `);
    
    if (admins.length > 0) {
        console.log('✅ Admin Account found:');
        console.log(JSON.stringify(admins[0], null, 2));
    } else {
        console.log('❌ No admin accounts found');
    }
    
    // Get sample customer with profile
    console.log('\n---\n');
    const customers = await query(`
        SELECT 
            TK.MaNguoiDung,
            TK.HoTen,
            TK.Email,
            TK.SDT,
            TK.DiaChi,
            TK.VaiTro,
            TK.GioiTinh,
            KH.LoaiThanhVien,
            KH.DiemTichLuy
        FROM TAI_KHOAN TK
        LEFT JOIN KHACH_HANG KH ON TK.MaNguoiDung = KH.MaNguoiDung
        WHERE TK.VaiTro = 'Khach' AND ROWNUM <= 1
    `);
    
    if (customers.length > 0) {
        console.log('✅ Customer Account found:');
        console.log(JSON.stringify(customers[0], null, 2));
    } else {
        console.log('❌ No customer accounts found');
    }
    
    process.exit(0);
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
