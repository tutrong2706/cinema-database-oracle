# Hệ Thống Quản Lý Rạp Chiếu Phim (Cinema Database)

Dự án cơ sở dữ liệu quản lý hệ thống rạp chiếu phim, bao gồm quản lý phim, suất chiếu, đặt vé, đơn hàng và báo cáo doanh thu.

## Cấu trúc thư mục

```text
cinema-database-btl2/
├── app/                    # Mã nguồn ứng dụng (nếu có)
├── docs/                   # Tài liệu báo cáo
├── sql/                    # Các script SQL
│   ├── 01_create_tables.sql      # Tạo bảng và ràng buộc
│   ├── 02_insert_data.sql        # Dữ liệu mẫu
│   ├── 03_sp_phim.sql            # SP quản lý Phim
│   ├── 04_sp_donhang.sql         # SP quản lý Đơn hàng & Mặt hàng
│   ├── 05_sp_ve.sql              # SP quản lý Đặt vé
│   ├── 06_functions.sql          # Các hàm tính toán (Doanh thu, check ghế)
│   ├── 07_triggers_business.sql  # Trigger ràng buộc nghiệp vụ
│   ├── 08_triggers_tongtien.sql  # Trigger tự động tính tổng tiền
│   ├── 09_sp_view_data.sql       # SP báo cáo & tra cứu
│   └── run_all.sql               # Script chạy toàn bộ hệ thống
└── README.md
Hướng dẫn cài đặt
Mở MySQL Workbench hoặc Command Line.
Đảm bảo bạn đang ở thư mục gốc của dự án.
Chạy file run_all.sql để khởi tạo toàn bộ cơ sở dữ liệu.

SOURCE ./sql/run_all.sql;
Các tính năng chính (Database Layer)
Quản lý Phim: Thêm, xóa, sửa phim với kiểm tra ràng buộc logic (không xóa phim đang chiếu).
Đặt vé & Đơn hàng:
Quy trình: Tạo đơn -> Thêm vé/bắp nước -> Thanh toán.
Tự động tính tổng tiền đơn hàng khi thêm món ăn (Trigger).
Kiểm tra trùng ghế, trùng suất chiếu.
Khuyến mãi: Kiểm tra ngày áp dụng và tính giá vé cuối cùng.
Báo cáo:
Xem lịch chiếu theo ngày.
Báo cáo doanh thu theo phim.
Lịch sử giao dịch khách hàng.