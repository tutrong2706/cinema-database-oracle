POST /auth/register

Mô tả: Đăng ký tài khoản khách hàng mới.

Body:

JSON

{
  "MaNguoiDung": "KH001", // Hoặc tự sinh ở Backend
  "HoTen": "Nguyễn Văn A",
  "Email": "a@gmail.com",
  "MatKhau": "hash_password",
  "SDT": "0987654321"
}
Prisma Logic: Dùng transaction để tạo cả tai_khoan và khach_hang cùng lúc.

POST /auth/login

Body: { "Email": "...", "MatKhau": "..." }

Response: Trả về Token và thông tin user (join bảng khach_hang để lấy LoaiThanhVien).

2. Phân hệ Rạp & Phim (Discovery)
Luồng: Khách chọn Rạp -> Xem danh sách Phim tại rạp đó.

GET /raps (Lấy danh sách rạp)

Prisma: prisma.rap_chieu_phim.findMany()

Response: [{ MaRapPhim, Ten, DiaChi, ... }]

GET /raps/{MaRapPhim}/phims ⭐ (Theo yêu cầu của bạn)

Mô tả: Lấy danh sách phim đang chiếu tại một rạp cụ thể.

Prisma: Query bảng trinh_chieu (bảng trung gian).

JavaScript

await prisma.trinh_chieu.findMany({
  where: { MaRapPhim: maRapId },
  include: { phim: true } // Join sang bảng Phim để lấy tên, ảnh...
})
GET /phims/{MaPhim}

Mô tả: Lấy chi tiết phim + Thể loại + Đánh giá.

Prisma: include: { the_loai_phim: true, danh_gia: true }

3. Phân hệ Suất chiếu & Ghế (Booking Flow)
Đây là phần quan trọng nhất: Chọn suất -> Hiển thị ghế (Đã đặt / Chưa đặt).

GET /suat-chieus

Mô tả: Tìm suất chiếu theo Rạp, Phim và Ngày.

Query: ?MaRapPhim=RP01&MaPhim=P01&NgayChieu=2024-02-10

Prisma:

JavaScript

prisma.suat_chieu.findMany({
   where: {
      MaPhim: ...,
      phong_chieu: { MaRapPhim: ... }, // Join ngược lên phòng -> rạp
      NgayChieu: ...
   }
})
GET /suat-chieus/{MaSuatChieu}/ghe ⭐ (Logic phức tạp nhất)

Mô tả: Trả về danh sách ghế của phòng chiếu đó, kèm trạng thái TrangThai: 'DaDat' | 'Trong'.

Logic xử lý (Controller):

Lấy thông tin suất chiếu để biết MaPhong.

Lấy tất cả ghế của phòng đó (bảng ghe).

Lấy tất cả vé đã bán của suất đó (bảng ve_xem_phim).

Dùng vòng lặp code (Javascript/Java...) để map trạng thái.

Ví dụ Response:

JSON

[
  { "HangGhe": "A", "SoGhe": 1, "status": "booked" }, // Có trong bảng ve_xem_phim
  { "HangGhe": "A", "SoGhe": 2, "status": "available" }
]
4. Phân hệ Đặt vé (Booking Transaction)
Dựa trên bảng don_hang và ve_xem_phim.

POST /dat-ve (Đặt vé - Giữ chỗ)

Body:

JSON

{
  "MaNguoiDung": "KH01",
  "MaSuatChieu": "SC01",
  "DanhSachGhe": [
     { "HangGhe": "A", "SoGhe": 1 },
     { "HangGhe": "A", "SoGhe": 2 }
  ],
  "TongTien": 200000
}
Prisma Transaction (Bắt buộc):

Tạo don_hang (Trạng thái: 'Pending').

Tạo nhiều record ve_xem_phim tương ứng với danh sách ghế gửi lên. Lưu ý: Bảng ve_xem_phim của bạn có khóa phức hợp Unique [MaSuatChieu, MaPhong, HangGhe, SoGhe], nên Prisma sẽ tự động quăng lỗi nếu ghế đó đã bị người khác nhanh tay đặt trước -> Rất an toàn.

5. Phân hệ Admin (Quản trị viên)
Dành cho user có MaNguoiDung tồn tại trong bảng quan_tri_vien.

POST /admin/phims (Thêm phim)

Body: Map đúng các trường bảng phim: { TenPhim, ThoiLuong, NgonNgu, QuocGia, NgayKhoiChieu, ... }.

POST /admin/suat-chieus (Tạo lịch chiếu)

Body: { MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan }.

GET /admin/doanh-thu

Mô tả: Tính tổng tiền từ bảng don_hang hoặc thanh_toan.

Prisma:

JavaScript

prisma.thanh_toan.aggregate({
  _sum: { SoTien: true },
  where: { NgayThanhToan: { gte: startDate, lte: endDate } }
})