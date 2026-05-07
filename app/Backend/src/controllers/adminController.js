import * as movieModel from '../models/movieModel.js';
import * as screeningModel from '../models/screeningModel.js';
import * as generalModel from '../models/generalModel.js';
import * as accountModel from '../models/accountModel.js';
import * as reportModel from '../models/reportModel.js';
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';

/**
 * GET /admin/phims - Lấy danh sách phim (với tìm kiếm)
 */
export async function getAllMoviesAdmin(req, res) {
    try {
        const { keyword = '' } = req.query;

        let phims;
        if (keyword) {
            phims = await movieModel.searchMovies(keyword);
        } else {
            phims = await movieModel.getAllMovies();
        }

        return res.status(200).json(handleSuccessResponse(200, 'OK', phims));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /admin/phims - Tạo phim
 */
export async function createMovie(req, res) {
    try {
        const movieData = req.body;

        // Validate (MaPhim will be auto-generated)
        if (!movieData.TenPhim) {
            return res.status(400).json(handleErrorResponse(400, 'TenPhim bắt buộc'));
        }

        await movieModel.createMovie(movieData);
        return res.status(201).json(handleSuccessResponse(201, 'Tạo phim thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * PUT /admin/phims/:id - Cập nhật phim
 */
export async function updateMovie(req, res) {
    try {
        const { id } = req.params;
        const movieData = req.body;

        const movie = await movieModel.getMovieById(id);
        if (!movie) {
            return res.status(404).json(handleErrorResponse(404, 'Phim không tồn tại'));
        }

        await movieModel.updateMovie(id, movieData);
        return res.status(200).json(handleSuccessResponse(200, 'Cập nhật phim thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * DELETE /admin/phims/:id - Xóa phim
 */
export async function deleteMovie(req, res) {
    try {
        const { id } = req.params;

        const movie = await movieModel.getMovieById(id);
        if (!movie) {
            return res.status(404).json(handleErrorResponse(404, 'Phim không tồn tại'));
        }

        await movieModel.deleteMovie(id);
        return res.status(200).json(handleSuccessResponse(200, 'Xóa phim thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /admin/suats - Lấy danh sách suất chiếu
 */
export async function getAllScreenings(req, res) {
    try {
        const screenings = await screeningModel.getAllScreenings();
        return res.status(200).json(handleSuccessResponse(200, 'OK', screenings));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /admin/suats - Tạo suất chiếu
 */
export async function createScreening(req, res) {
    try {
        const screeningData = req.body;

        // Validate required fields (MaSuatChieu will be auto-generated)
        if (!screeningData.MaPhim || !screeningData.MaPhong) {
            return res.status(400).json(handleErrorResponse(400, 'MaPhim và MaPhong bắt buộc'));
        }

        await screeningModel.createScreening(screeningData);
        return res.status(201).json(handleSuccessResponse(201, 'Tạo suất chiếu thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * PUT /admin/suats/:id - Cập nhật suất chiếu
 */
export async function updateScreening(req, res) {
    try {
        const { id } = req.params;
        const screeningData = req.body;

        const screening = await screeningModel.getScreeningById(id);
        if (!screening) {
            return res.status(404).json(handleErrorResponse(404, 'Suất chiếu không tồn tại'));
        }

        await screeningModel.updateScreening(id, screeningData);
        return res.status(200).json(handleSuccessResponse(200, 'Cập nhật suất chiếu thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * DELETE /admin/suats/:id - Xóa suất chiếu
 */
export async function deleteScreening(req, res) {
    try {
        const { id } = req.params;

        const screening = await screeningModel.getScreeningById(id);
        if (!screening) {
            return res.status(404).json(handleErrorResponse(404, 'Suất chiếu không tồn tại'));
        }

        await screeningModel.deleteScreening(id);
        return res.status(200).json(handleSuccessResponse(200, 'Xóa suất chiếu thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /admin/orders - Lấy danh sách tất cả đơn hàng
 */
export async function getAllOrders(req, res) {
    try {
        const orders = await generalModel.getAllOrders();
        return res.status(200).json(handleSuccessResponse(200, 'OK', orders));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /admin/revenue - Lấy doanh thu
 */
export async function getRevenue(req, res) {
    try {
        const { startDate, endDate } = req.query;

        const revenue = await generalModel.getRevenue(startDate, endDate);
        return res.status(200).json(handleSuccessResponse(200, 'OK', revenue));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /admin/create-admin - Tạo tài khoản Admin (chỉ Admin mới có quyền)
 * Yêu cầu: { hoTen, email, password, sDT, diaChi }
 */
export async function createAdmin(req, res) {
    try {
        const { hoTen, email, password, sDT, diaChi } = req.body;

        // Validate input
        if (!email || !password || !hoTen) {
            return res.status(400).json(handleErrorResponse(400, 'Thông tin bắt buộc không đủ (hoTen, email, password)'));
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await accountModel.getAccountByEmail(email);
        if (existingUser) {
            return res.status(400).json(handleErrorResponse(400, 'Email đã được sử dụng'));
        }

        // Tạo ID Admin
        const maNguoiDung = `ADMIN_${Date.now()}`;

        // Tạo account với role Admin
        await accountModel.createAccount({
            MaNguoiDung: maNguoiDung,
            HoTen: hoTen,
            Email: email,
            MatKhau: password,
            SDT: sDT || '',
            DiaChi: diaChi || '',
            VaiTro: 'Admin'  // ← Admin role
        });

        return res.status(201).json(
            handleSuccessResponse(201, 'Tạo tài khoản Admin thành công', {
                maNguoiDung,
                hoTen,
                email,
                vaiTro: 'Admin'
            })
        );
    } catch (error) {
        console.error('Create Admin Error:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * PATCH /admin/users/:userId/role - Thay đổi role của người dùng
 * Yêu cầu: { newRole: 'Admin' | 'Khach' }
 */
export async function changeUserRole(req, res) {
    try {
        const { userId } = req.params;
        const { newRole } = req.body;

        // Validate role
        if (!['Admin', 'Khach'].includes(newRole)) {
            return res.status(400).json(handleErrorResponse(400, 'Role không hợp lệ. Chỉ "Admin" hoặc "Khach"'));
        }

        // Lấy user hiện tại
        const user = await accountModel.getAccountById(userId);
        if (!user) {
            return res.status(404).json(handleErrorResponse(404, 'Người dùng không tồn tại'));
        }

        // Cập nhật role
        await accountModel.updateAccount(userId, {
            HoTen: user.HOTEN,
            SDT: user.SDT || '',
            DiaChi: user.DIACHI || '',
            VaiTro: newRole
        });

        if (newRole === 'Khach') {
            await accountModel.ensureCustomerProfile(userId);
        }

        return res.status(200).json(
            handleSuccessResponse(200, `Thay đổi role thành "${newRole}" thành công`, {
                userId,
                newRole,
                previousRole: user.VAITRO
            })
        );
    } catch (error) {
        console.error('Change Role Error:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /admin/users - Lấy danh sách tất cả người dùng (chỉ Admin)
 */
export async function getAllUsers(req, res) {
    try {
        const users = await accountModel.getAllAccounts();
        
        // Loại bỏ password để bảo mật
        const safeUsers = users.map(user => ({
            maNguoiDung: user.MANGUOIDUNG,
            hoTen: user.HOTEN,
            email: user.EMAIL,
            sDT: user.SDT,
            diaChi: user.DIACHI,
            gioiTinh: user.GIOITINH,
            vaiTro: user.VAITRO
        }));

        return res.status(200).json(
            handleSuccessResponse(200, `Danh sách ${safeUsers.length} người dùng`, safeUsers)
        );
    } catch (error) {
        console.error('Get Users Error:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /admin/users/count - Thống kê số lượng Admin và Khách
 */
export async function getUserStats(req, res) {
    try {
        const users = await accountModel.getAllAccounts();
        
        const stats = {
            totalUsers: users.length,
            admins: users.filter(u => u.VAITRO === 'Admin').length,
            customers: users.filter(u => u.VAITRO === 'Khach').length
        };

        return res.status(200).json(handleSuccessResponse(200, 'Thống kê người dùng', stats));
    } catch (error) {
        console.error('Get Stats Error:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /admin/revenue/movie - Lấy doanh thu theo phim
 * Query params: startDate, endDate
 */
export async function getRevenueByMovie(req, res) {
    console.log('🔴 [API] getRevenueByMovie called');
    try {
        const { startDate, endDate } = req.query;
        console.log('   Params:', { startDate, endDate });

    

        const movieRevenue = await reportModel.getRevenueByMovie(startDate, endDate);
        console.log('   ✅ Result:', movieRevenue?.length || 0, 'rows');
        return res.status(200).json(handleSuccessResponse(200, 'OK', movieRevenue));
    } catch (error) {
        console.error('❌ Revenue by Movie Error:', error.message);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /admin/revenue/cinema - Lấy doanh thu theo rạp
 * Query params: startDate, endDate
 */
export async function getRevenueBycinema(req, res) {
    try {
        const { startDate, endDate } = req.query;

    
        const cinemaRevenue = await reportModel.getRevenueBycinema(startDate, endDate);
        return res.status(200).json(handleSuccessResponse(200, 'OK', cinemaRevenue));
    } catch (error) {
        console.error('Revenue by Cinema Error:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /admin/reports/top-movies - Lấy top phim phổ biến
 * Query params: limit (default 10)
 */
export async function getTopMovies(req, res) {
    try {
        const { limit = 10 } = req.query;

        const topMovies = await reportModel.getPopularMovies(parseInt(limit));
        return res.status(200).json(handleSuccessResponse(200, 'OK', topMovies));
    } catch (error) {
        console.error('Top Movies Error:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}
export async function getComboRevenue(req, res) {
    try {
        const comboRevenue = await reportModel.getComboRevenue();
        return res.status(200).json(handleSuccessResponse(200, 'OK', comboRevenue));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

export async function getComboRevenueByMovie(req, res) {
    try {
        const comboByMovie = await reportModel.getComboRevenueByMovie();
        return res.status(200).json(handleSuccessResponse(200, 'OK', comboByMovie));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}