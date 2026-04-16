import prisma from "../common/prisma/prisma.init.js";

class UserService {
    // Get user transaction history (using SP_GetUserTransactionHistory)
    async getTransactionHistory(userId) {
        try {
            const orders = await prisma.$queryRaw`
                SELECT 
                    dh.MaDonHang,
                    dh.ThoiGianDat,
                    dh.TrangThai,
                    dh.TongTien,
                    dh.PhuongThuc,
                    COUNT(DISTINCT ve.MaVe) AS SoVe,
                    COUNT(DISTINCT g.MaHang) AS SoHang
                FROM DON_HANG dh
                LEFT JOIN VE_XEM_PHIM ve ON dh.MaDonHang = ve.MaDonHang
                LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
                WHERE dh.MaNguoiDung_KH = ${userId}
                GROUP BY dh.MaDonHang, dh.ThoiGianDat, dh.TrangThai, dh.TongTien, dh.PhuongThuc
                ORDER BY dh.ThoiGianDat DESC
            `;
            return orders;
        } catch (error) {
            throw new Error("Lỗi khi lấy lịch sử giao dịch: " + error.message);
        }
    }
}

export default new UserService();
