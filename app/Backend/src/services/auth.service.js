import { BadRequestError, InternalServerError, UnAuthorizedError, NotFoundError } from "../helpers/handleError.js";
import prisma from "../common/prisma/prisma.init.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10

class authService {
    // ================================
    //  ĐĂNG KÝ
    // ================================
    async register(data) {
        const {
            email,
            password,
            hoten,
            gioitinh,
            sdt,
            diachi
        } = data;

        // Sửa: Dùng Email (viết hoa chữ cái đầu theo schema)
        const existing = await prisma.tai_khoan.findUnique({
            where: { Email: email }
        });

        if (existing) {
            throw new BadRequestError("Email đã tồn tại");
        }

        const hashed = await bcrypt.hash(password, 10);
        const id = "KH" + Date.now();

        const account = await prisma.tai_khoan.create({
            data: {
                MaNguoiDung: id,
                HoTen: hoten,
                SDT: sdt ?? null,
                GioiTinh: gioitinh ?? null,
                DiaChi: diachi ?? null,
                Email: email,
                MatKhau: hashed,
                khach_hang: {
                    create: {
                        MaNguoiDung: id,
                        LoaiThanhVien: "Bronze", // Mặc định là Bronze cho khớp database
                        DiemTichLuy: 0
                    }
                }
            }
        });

        return account;
    }

    // ================================
    //  ĐĂNG NHẬP
    // ================================
    async login(data) {
        const email = data.email?.trim();
        const password = data.password?.trim();

        if (!email || !password) {
            throw new BadRequestError("Thiếu thông tin bắt buộc");
        }

        // Sửa 1: where: { Email: email } thay vì EMAIL
        // Sửa 2: include thêm quan_tri_vien để check role
        const user = await prisma.tai_khoan.findUnique({
            where: { Email: email },
            include: {
                khach_hang: true,
                quan_tri_vien: true
            }
        });

        if (!user) {
            throw new BadRequestError("User không tồn tại");
        }

        // Sửa 3: Kiểm tra mật khẩu
        // Ưu tiên check bcrypt (cho user mới đăng ký)
        let isMatch = await bcrypt.compare(password, user.MatKhau);
        
        // Nếu bcrypt fail, check so sánh chuỗi thường (cho user cũ trong seed data như 'passA')
        if (!isMatch && password === user.MatKhau) {
            isMatch = true;
        }

        if (!isMatch) {
            throw new BadRequestError("Sai mật khẩu");
        }

        // Sửa 4: Xác định Role (Vì bảng tai_khoan không có cột LoaiTaiKhoan)
        let role = "Guest";
        let loaiThanhVien = null;

        if (user.quan_tri_vien) {
            role = "Admin";
        } else if (user.khach_hang) {
            role = "Customer";
            loaiThanhVien = user.khach_hang.LoaiThanhVien;
        }

        // Sửa 5: user.Email thay vì user.EMAIL
        const payload = {
            userId: user.MaNguoiDung,
            email: user.Email,
            role: role,
            loaiThanhVien: loaiThanhVien
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        return {
            userInfo: {
                email: user.Email,
                role: role,
                loaiThanhVien: loaiThanhVien,
                hoTen: user.HoTen
            },
            token
        };
    }

    // ================================
    //  ĐĂNG XUẤT
    // ================================
    async logout() {
        return { message: "Đăng xuất thành công" };
    }

    // Get all cinema branches (using SP_GetAllCinemaBranches)
    async getRaps() {
        try {
            const raps = await prisma.$queryRaw`
                SELECT MaRapPhim, TenRap, DiaChi
                FROM RAP_CHIEU_PHIM
                ORDER BY TenRap
            `;
            return raps;
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách rạp: " + error.message);
        }
    }

    // Get movies by cinema (using SP_GetMoviesByCinema)
    async getPhimsByRap(MaRapPhim) {
        try {
            const phims = await prisma.$queryRaw`
                SELECT DISTINCT
                    p.MaPhim, p.TenPhim, p.ThoiLuong, p.NgayKhoiChieu,
                    p.ChuDePhim, p.Anh
                FROM PHIM p
                JOIN SUAT_CHIEU sc ON p.MaPhim = sc.MaPhim
                JOIN PHONG_CHIEU pc ON sc.MaPhong = pc.MaPhong
                WHERE pc.MaRapPhim = ${MaRapPhim}
                  AND sc.TrangThai <> 'Hủy'
                  AND sc.NgayChieu >= TRUNC(SYSDATE)
                ORDER BY p.NgayKhoiChieu DESC
            `;
            return phims || [];
        } catch (error) {
            throw new Error("Lỗi khi lấy phim theo rạp: " + error.message);
        }
    }

    // Get movie details with reviews (using SP_GetMovieDetailFull)
    async getPhimDetail(MaPhim) {
        try {
            const phim = await prisma.$queryRaw`
                SELECT 
                    p.MaPhim, p.TenPhim, p.ThoiLuong, p.NgonNgu, p.QuocGia,
                    p.DaoDien, p.DienVienChinh, p.NgayKhoiChieu, p.MoTaNoiDung,
                    p.DoTuoi, p.ChuDePhim, p.Anh,
                    ROUND(AVG(dg.DiemSo), 1) AS DiemTrungBinh,
                    COUNT(DISTINCT dg.MaDanhGia) AS TongDanhGia
                FROM PHIM p
                LEFT JOIN DANH_GIA dg ON p.MaPhim = dg.MaPhim
                WHERE p.MaPhim = ${MaPhim}
                GROUP BY p.MaPhim, p.TenPhim, p.ThoiLuong, p.NgonNgu, p.QuocGia,
                         p.DaoDien, p.DienVienChinh, p.NgayKhoiChieu, p.MoTaNoiDung,
                         p.DoTuoi, p.ChuDePhim, p.Anh
            `;
            
            if (!phim || phim.length === 0) {
                throw new NotFoundError("Không tìm thấy phim");
            }
            
            return phim[0];
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            throw new Error("Lỗi khi lấy chi tiết phim: " + error.message);
        }
    }

    async getSuatChieus({ MaRapPhim, MaPhim, NgayChieu }) {
        try {
            const suatChieus = await prisma.$queryRaw`
                SELECT 
                    sc.MaSuatChieu,
                    sc.MaPhim,
                    sc.MaPhong,
                    sc.NgayChieu,
                    sc.GioBatDau,
                    sc.GioKetThuc,
                    sc.GiaVeCoBan,
                    sc.TrangThai,
                    pc.TenPhong,
                    pc.SoGheToiDa,
                    (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = sc.MaSuatChieu AND TrangThai <> 'Hủy') AS GheDaBan,
                    (pc.SoGheToiDa - (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = sc.MaSuatChieu AND TrangThai <> 'Hủy')) AS GheTrong
                FROM SUAT_CHIEU sc
                JOIN PHONG_CHIEU pc ON sc.MaPhong = pc.MaPhong
                WHERE sc.MaPhim = ${MaPhim}
                  AND pc.MaRapPhim = ${MaRapPhim}
                  AND TRUNC(sc.NgayChieu) = TRUNC(${new Date(NgayChieu)})
                  AND sc.TrangThai <> 'Hủy'
                ORDER BY sc.GioBatDau ASC
            `;
            return suatChieus || [];
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách suất chiếu: " + error.message);
        }
    }

    // ================================
    //  ĐẶT VÉ (GỌI STORED PROCEDURE)
    // ================================
    async bookingTicket(data) {
        const {
            MaNguoiDung,
            MaSuatChieu,
            MaPhong,
            DanhSachGhe
        } = data;

        const MaDonHang = "DH" + Date.now();
        
        // Gọi SP tạo đơn hàng
        await prisma.$executeRaw`CALL SP_TaoDonHang(${MaDonHang}, ${MaNguoiDung}, 'Online')`;

        const results = [];
        for (const ghe of DanhSachGhe) {
            const MaVe = "VE" + Math.floor(Math.random() * 1000000);
            try {
                await prisma.$executeRaw`CALL SP_DatVe(${MaVe}, ${MaSuatChieu}, ${MaPhong}, ${ghe.HangGhe}, ${ghe.SoGhe}, ${MaNguoiDung}, ${MaDonHang})`;
                results.push({ MaVe, status: "Success" });
            } catch (error) {
                console.error("Lỗi đặt ghế:", ghe, error.message);
                results.push({ ghe, status: "Failed", reason: error.message });
            }
        }

        return { MaDonHang, results };
    }

    // Thêm hàm này vào class authService
    async searchPhim(keyword = "") {
        const search = keyword ? `%${keyword.trim()}%` : '%';
        
        // Tìm kiếm đa năng trên nhiều trường: Tên, Đạo diễn, Diễn viên, Quốc gia, Năm
        const phims = await prisma.$queryRaw`
            SELECT p.MaPhim, p.TenPhim, p.ThoiLuong, p.NgonNgu, p.QuocGia,
                   p.DaoDien, p.DienVienChinh, p.NgayKhoiChieu, p.MoTaNoiDung,
                   p.DoTuoi, p.ChuDePhim, p.Anh,
                   COALESCE(AVG(d.DiemSo), 0) as DiemDanhGia
            FROM PHIM p
            LEFT JOIN DANH_GIA d ON p.MaPhim = d.MaPhim
            WHERE p.TenPhim LIKE ${search}
               OR p.DaoDien LIKE ${search}
               OR p.DienVienChinh LIKE ${search}
               OR p.QuocGia LIKE ${search}
               OR CAST(YEAR(p.NgayKhoiChieu) AS CHAR) LIKE ${search}
            GROUP BY p.MaPhim
            ORDER BY p.NgayKhoiChieu DESC
        `;
        return phims;
    }
    async getNowShowingPhims() {
        try {
            const phims = await prisma.$queryRaw`
                SELECT DISTINCT
                    p.MaPhim,
                    p.TenPhim,
                    p.Anh,
                    p.ThoiLuong,
                    p.NgayKhoiChieu,
                    COALESCE(ROUND(AVG(dg.DiemSo), 1), 0) AS DiemDanhGia,
                    COUNT(DISTINCT sc.MaSuatChieu) AS SoSuatChieu
                FROM PHIM p
                LEFT JOIN DANH_GIA dg ON p.MaPhim = dg.MaPhim
                JOIN SUAT_CHIEU sc ON p.MaPhim = sc.MaPhim
                WHERE sc.NgayChieu >= TRUNC(SYSDATE)
                  AND sc.TrangThai <> 'Hủy'
                GROUP BY p.MaPhim, p.TenPhim, p.Anh, p.ThoiLuong, p.NgayKhoiChieu
                ORDER BY p.NgayKhoiChieu DESC
            `;
            return phims || [];
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách phim đang chiếu: " + error.message);
        }
    }

    // FIX: Thêm hàm lấy phim theo rating cao nhất
    async getPhimsSortedByRating() {
        try {
            // Lấy top 10 phim có điểm đánh giá cao nhất
            const result = await prisma.$queryRaw`
                SELECT *
                FROM (
                    SELECT 
                        p.MaPhim, p.TenPhim, p.Anh, p.ThoiLuong, p.NgayKhoiChieu,
                        COALESCE(ROUND(AVG(dg.DiemSo), 1), 0) as DiemDanhGia,
                        COUNT(DISTINCT dg.MaDanhGia) AS TongDanhGia
                    FROM PHIM p
                    LEFT JOIN DANH_GIA dg ON p.MaPhim = dg.MaPhim
                    GROUP BY p.MaPhim, p.TenPhim, p.Anh, p.ThoiLuong, p.NgayKhoiChieu
                    ORDER BY DiemDanhGia DESC, TongDanhGia DESC
                )
                WHERE ROWNUM <= 10
            `;
            return result || [];
        } catch (error) {
            throw new Error("Lỗi khi lấy phim theo rating: " + error.message);
        }
    }
    async filterPhims({ tenPhim, theLoai, nam }) {
        try {
            // Chuyển đổi tham số để phù hợp với SQL (null nếu không có giá trị)
            const searchName = tenPhim ? `%${tenPhim.toUpperCase()}%` : null;

            // Query Raw thay thế Prisma ORM
            const result = await prisma.$queryRaw`
                SELECT DISTINCT p.MaPhim, p.TenPhim, p.Anh, p.ThoiLuong, p.NgayKhoiChieu, 
                       COALESCE(ROUND(AVG(dg.DiemSo), 1), 0) as DiemDanhGia
                FROM PHIM p
                LEFT JOIN THE_LOAI_PHIM tlp ON p.MaPhim = tlp.MaPhim
                LEFT JOIN DANH_GIA dg ON p.MaPhim = dg.MaPhim
                WHERE (${searchName} IS NULL OR UPPER(p.TenPhim) LIKE ${searchName})
                  AND (${theLoai} IS NULL OR tlp.TheLoai = ${theLoai})
                  AND (${nam} IS NULL OR YEAR(p.NgayKhoiChieu) = ${nam})
                GROUP BY p.MaPhim, p.TenPhim, p.Anh, p.ThoiLuong, p.NgayKhoiChieu
                ORDER BY p.NgayKhoiChieu DESC
            `;
            
            return result || [];
        } catch (error) {
            throw new Error("Lỗi khi lọc phim: " + error.message);
        }
    }

    // ================================
    //  LẤY THÔNG TIN CÁ NHÂN
    // ================================
    async getUserProfile(MaNguoiDung) {
        try {
            const user = await prisma.$queryRaw`
                SELECT 
                    tk.MaNguoiDung,
                    tk.HoTen,
                    tk.Email,
                    tk.SDT,
                    tk.DiaChi,
                    tk.GioiTinh,
                    kh.LoaiThanhVien,
                    kh.DiemTichLuy,
                    FUNC_XepHangThanhVien(${MaNguoiDung}) AS HangThanhVienCurrent,
                    (SELECT COUNT(*) FROM DON_HANG WHERE MaNguoiDung_KH = ${MaNguoiDung}) AS TongDonHang,
                    (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaNguoiDung_KH = ${MaNguoiDung} AND TrangThai <> 'Hủy') AS TongVeDat,
                    (SELECT COALESCE(SUM(TongTien), 0) FROM DON_HANG WHERE MaNguoiDung_KH = ${MaNguoiDung} AND TrangThai = 'Đã thanh toán') AS TongChiTieu
                FROM TAI_KHOAN tk
                LEFT JOIN KHACH_HANG kh ON tk.MaNguoiDung = kh.MaNguoiDung
                WHERE tk.MaNguoiDung = ${MaNguoiDung}
            `;

            if (!user || user.length === 0) {
                throw new NotFoundError("Không tìm thấy thông tin người dùng");
            }

            const userData = user[0];
            return {
                MaNguoiDung: userData.MaNguoiDung,
                HoTen: userData.HoTen,
                Email: userData.Email,
                SDT: userData.SDT,
                DiaChi: userData.DiaChi,
                GioiTinh: userData.GioiTinh,
                LoaiThanhVien: userData.HangThanhVienCurrent || userData.LoaiThanhVien || 'Bronze',
                DiemTichLuy: userData.DiemTichLuy || 0,
                TongDonHang: userData.TongDonHang || 0,
                TongVeDat: userData.TongVeDat || 0,
                TongChiTieu: userData.TongChiTieu || 0
            };
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            throw new Error("Lỗi khi lấy thông tin cá nhân: " + error.message);
        }
    }

    // ================================
    //  LẤY DANH SÁCH COMBO
    // ================================
    async getCombos() {
        try {
            const combos = await prisma.$queryRaw`
                SELECT 
                    MaHang,
                    TenHang,
                    DonGia,
                    LoaiHang,
                    MoTa
                FROM MAT_HANG
                WHERE LoaiHang = 'DO_AN'
                ORDER BY TenHang
            `;
            return combos || [];
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách combo: " + error.message);
        }
    }

    // ================================
    //  ĐẶT VÉ (Booking)
    // ================================
    async booking(userId, data) {
        const { MaSuatChieu, MaPhong, DanhSachGhe, DanhSachCombo, isPayLater } = data;
        // DanhSachGhe: [{ HangGhe: 'A', SoGhe: 1 }, ...]
        // DanhSachCombo: [{ MaHang: 'MH01', SoLuong: 2 }, ...]

        return await prisma.$transaction(async (tx) => {
            // 1. Tạo Đơn Hàng
            const maDonHang = "DH" + Date.now();
            const trangThai = isPayLater ? "Chờ thanh toán" : "Đã thanh toán";
            
            // Tính tổng tiền vé
            const suatChieu = await tx.suat_chieu.findUnique({
                where: { MaSuatChieu }
            });
            if (!suatChieu) throw new BadRequestError("Suất chiếu không tồn tại");
            
            const giaVe = Number(suatChieu.GiaVeCoBan);
            const tongTienVe = giaVe * DanhSachGhe.length;
            
            // Tính tổng tiền Combo
            let tongTienCombo = 0;
            if (DanhSachCombo && DanhSachCombo.length > 0) {
                for (const combo of DanhSachCombo) {
                    const item = await tx.mat_hang.findUnique({ where: { MaHang: combo.MaHang } });
                    if (item) {
                        tongTienCombo += Number(item.DonGia) * combo.SoLuong;
                    }
                }
            }
            
            const tongTien = tongTienVe + tongTienCombo;

            await tx.don_hang.create({
                data: {
                    MaDonHang: maDonHang,
                    MaNguoiDung_KH: userId,
                    PhuongThuc: "Thẻ tín dụng", // Mặc định hoặc từ FE
                    ThoiGianDat: new Date(),
                    TongTien: 0, // Đặt về 0 vì Trigger trong DB sẽ tự động cộng tiền Vé và Combo vào
                    TrangThai: trangThai
                }
            });

            // 2. Tạo Vé
            for (const ghe of DanhSachGhe) {
                await tx.ve_xem_phim.create({
                    data: {
                        MaVe: "VE" + Math.floor(Math.random() * 1000000) + Date.now().toString().slice(-4),
                        MaSuatChieu,
                        MaPhong,
                        HangGhe: ghe.HangGhe,
                        SoGhe: ghe.SoGhe,
                        MaNguoiDung_KH: userId,
                        MaDonHang: maDonHang,
                        GiaVeCuoi: giaVe,
                        NgayDat: new Date(),
                        TrangThai: trangThai === "Đã thanh toán" ? "Đã thanh toán" : "Đã đặt"
                    }
                });
            }

            // 3. Tạo GOM (Combo items)
            if (DanhSachCombo && DanhSachCombo.length > 0) {
                for (const combo of DanhSachCombo) {
                    const item = await tx.mat_hang.findUnique({ where: { MaHang: combo.MaHang } });
                    if (item) {
                        await tx.gom.create({
                            data: {
                                MaDonHang: maDonHang,
                                MaHang: combo.MaHang,
                                SoLuong: combo.SoLuong,
                                DonGia: item.DonGia
                            }
                        });
                    }
                }
            }

            // 4. Tạo Thanh Toán (Chỉ khi thanh toán ngay)
            if (!isPayLater) {
                await tx.thanh_toan.create({
                    data: {
                        MaThanhToan: "TT" + Date.now(),
                        MaDonHang: maDonHang,
                        NgayThanhToan: new Date(),
                        PhuongThuc: "Thẻ tín dụng",
                        TrangThai: "Đã thanh toán",
                        SoTien: tongTien
                    }
                });
            }

            return { MaDonHang: maDonHang, TongTien: tongTien };
        });
    }

    // ================================
    //  THANH TOÁN ĐƠN HÀNG (Pay Order)
    // ================================
    async payOrder(MaDonHang) {
        return await prisma.$transaction(async (tx) => {
            const donHang = await tx.don_hang.findUnique({ where: { MaDonHang } });
            if (!donHang) throw new NotFoundError("Đơn hàng không tồn tại");
            if (donHang.TrangThai === "Đã thanh toán") throw new BadRequestError("Đơn hàng đã được thanh toán");
            if (donHang.TrangThai === "Hủy") throw new BadRequestError("Đơn hàng đã bị hủy");

            // 1. Tạo Thanh Toán TRƯỚC (Để Trigger TRG_VE_CheckThanhToan không chặn update vé)
            // Lưu ý: Trigger TRG_TT_CongDiemThuong_Insert trong DB sẽ tự động update DON_HANG -> 'Đã thanh toán'
            await tx.thanh_toan.create({
                data: {
                    MaThanhToan: "TT" + Date.now(),
                    MaDonHang: MaDonHang,
                    NgayThanhToan: new Date(),
                    PhuongThuc: donHang.PhuongThuc,
                    TrangThai: "Đã thanh toán",
                    SoTien: donHang.TongTien
                }
            });

            // 2. Cập nhật Vé (Lúc này đã có Thanh Toán nên Trigger cho phép)
            await tx.ve_xem_phim.updateMany({
                where: { MaDonHang },
                data: { TrangThai: "Đã thanh toán" }
            });

            return { message: "Thanh toán thành công" };
        });
    }

    // ================================
    //  HỦY ĐƠN HÀNG (Cancel Order)
    // ================================
    async cancelOrder(MaDonHang) {
        return await prisma.$transaction(async (tx) => {
            const donHang = await tx.don_hang.findUnique({ where: { MaDonHang } });
            if (!donHang) throw new NotFoundError("Đơn hàng không tồn tại");
            if (donHang.TrangThai === "Đã thanh toán") throw new BadRequestError("Không thể hủy đơn hàng đã thanh toán");

            // Cập nhật Đơn Hàng
            await tx.don_hang.update({
                where: { MaDonHang },
                data: { TrangThai: "Hủy" }
            });

            // Cập nhật Vé
            await tx.ve_xem_phim.updateMany({
                where: { MaDonHang },
                data: { TrangThai: "Hủy" }
            });

            return { message: "Hủy đơn hàng thành công" };
        });
    }

    // ================================
    //  LẤY CHI TIẾT ĐƠN HÀNG
    // ================================
    async getOrderDetails(MaDonHang) {
        try {
            const orderDetails = await prisma.$queryRaw`
                SELECT 
                    dh.MaDonHang,
                    dh.MaNguoiDung_KH,
                    dh.PhuongThuc,
                    dh.ThoiGianDat,
                    dh.TongTien,
                    dh.TrangThai,
                    vxp.MaVe,
                    vxp.HangGhe,
                    vxp.SoGhe,
                    vxp.GiaVeCuoi,
                    sc.NgayChieu,
                    sc.GioBatDau,
                    sc.GioKetThuc,
                    p.MaPhim,
                    p.TenPhim,
                    p.Anh,
                    pc.TenPhong,
                    r.TenRap,
                    gom.MaHang,
                    mh.TenHang,
                    gom.SoLuong,
                    gom.DonGia
                FROM DON_HANG dh
                LEFT JOIN VE_XEM_PHIM vxp ON dh.MaDonHang = vxp.MaDonHang
                LEFT JOIN SUAT_CHIEU sc ON vxp.MaSuatChieu = sc.MaSuatChieu
                LEFT JOIN PHIM p ON sc.MaPhim = p.MaPhim
                LEFT JOIN PHONG_CHIEU pc ON vxp.MaPhong = pc.MaPhong
                LEFT JOIN RAP_CHIEU_PHIM r ON pc.MaRapPhim = r.MaRapPhim
                LEFT JOIN GOM gom ON dh.MaDonHang = gom.MaDonHang
                LEFT JOIN MAT_HANG mh ON gom.MaHang = mh.MaHang
                WHERE dh.MaDonHang = ${MaDonHang}
                ORDER BY vxp.MaVe, gom.MaHang
            `;

            if (!orderDetails || orderDetails.length === 0) {
                throw new NotFoundError("Đơn hàng không tồn tại");
            }

            // Format data từ flat result set
            const firstRow = orderDetails[0];
            const seats = [];
            const combos = [];

            for (const row of orderDetails) {
                if (row.MaVe && !seats.find(s => s.MaVe === row.MaVe)) {
                    seats.push({
                        MaVe: row.MaVe,
                        HangGhe: row.HangGhe,
                        SoGhe: row.SoGhe,
                        GiaVeCuoi: row.GiaVeCuoi
                    });
                }
                if (row.MaHang && !combos.find(c => c.MaHang === row.MaHang)) {
                    combos.push({
                        MaHang: row.MaHang,
                        TenHang: row.TenHang,
                        SoLuong: row.SoLuong,
                        DonGia: row.DonGia
                    });
                }
            }

            return {
                MaDonHang: firstRow.MaDonHang,
                MaNguoiDung: firstRow.MaNguoiDung_KH,
                TrangThai: firstRow.TrangThai,
                TongTien: firstRow.TongTien,
                ThoiGianDat: firstRow.ThoiGianDat,
                PhuongThuc: firstRow.PhuongThuc,
                suatChieu: firstRow.MaPhim ? {
                    MaSuatChieu: firstRow.MaSuatChieu,
                    NgayChieu: firstRow.NgayChieu,
                    GioBatDau: firstRow.GioBatDau,
                    GioKetThuc: firstRow.GioKetThuc,
                    phim: {
                        MaPhim: firstRow.MaPhim,
                        TenPhim: firstRow.TenPhim,
                        Anh: firstRow.Anh
                    },
                    phong_chieu: {
                        TenPhong: firstRow.TenPhong,
                        rap_chieu_phim: {
                            TenRap: firstRow.TenRap
                        }
                    }
                } : null,
                seats: seats,
                combos: combos
            };
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            throw new Error("Lỗi khi lấy chi tiết đơn hàng: " + error.message);
        }
    }

    // ================================
    //  BÁO CÁO DOANH THU (MOVED TO ADMIN SERVICE)
    // ================================

    // ================================
    //  LẤY GHẾ ĐÃ ĐẶT
    // ================================
    async getBookedSeats(MaSuatChieu) {
        try {
            const bookedSeats = await prisma.$queryRaw`
                SELECT 
                    HangGhe,
                    SoGhe,
                    TrangThai
                FROM VE_XEM_PHIM
                WHERE MaSuatChieu = ${MaSuatChieu}
                  AND TrangThai <> 'Hủy'
                ORDER BY HangGhe, SoGhe
            `;
            return bookedSeats || [];
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách ghế đã đặt: " + error.message);
        }
    }

}

export default new authService();