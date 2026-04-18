import jwt from 'jsonwebtoken';
import * as accountModel from '../models/accountModel.js';
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';

/**
 * POST /auth/login - Đăng nhập
 */
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(handleErrorResponse(400, 'Email và password bắt buộc'));
        }

        const user = await accountModel.getAccountByEmail(email);

        if (!user) {
            return res.status(401).json(handleErrorResponse(401, 'Email không tồn tại'));
        }

        // So sánh mật khẩu (trong thực tế dùng bcrypt)
        if (password !== user.MATKHAU) {
            return res.status(401).json(handleErrorResponse(401, 'Mật khẩu không chính xác'));
        }

        // Tạo JWT token với role information
        const token = jwt.sign(
            { 
                userId: user.MANGUOIDUNG, 
                email: user.EMAIL,
                vaiTro: user.VAITRO 
            },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '24h' }
        );

        const userInfo = {
            userId: user.MANGUOIDUNG,
            hoTen: user.HOTEN,
            email: user.EMAIL,
            vaiTro: user.VAITRO
        };

        return res.status(200).json(handleSuccessResponse(200, 'Đăng nhập thành công', { token, userInfo }));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /auth/register - Đăng ký
 */
export async function register(req, res) {
    try {
        const { hoTen, email, password, sDT, diaChi } = req.body;

        if (!email || !password || !hoTen) {
            return res.status(400).json(handleErrorResponse(400, 'Thông tin bắt buộc không đủ'));
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await accountModel.getAccountByEmail(email);
        if (existingUser) {
            return res.status(400).json(handleErrorResponse(400, 'Email đã được sử dụng'));
        }

        // Tạo ID người dùng
        const maNguoiDung = `USER_${Date.now()}`;

        await accountModel.createAccount({
            MaNguoiDung: maNguoiDung,
            HoTen: hoTen,
            Email: email,
            MatKhau: password,
            SDT: sDT || '',
            DiaChi: diaChi || '',
            VaiTro: 'Khach'
        });

        return res.status(201).json(handleSuccessResponse(201, 'Đăng ký thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /auth/profile - Lấy thông tin profile đầy đủ
 */
export async function getProfile(req, res) {
    try {
        const { userId } = req.user;
        const user = await accountModel.getFullProfile(userId);

        if (!user) {
            return res.status(404).json(handleErrorResponse(404, 'Người dùng không tồn tại'));
        }

        console.log('📋 Profile data from DB:', JSON.stringify(user, null, 2));
        console.log('🔍 User ID:', userId);

        return res.status(200).json(handleSuccessResponse(200, 'OK', user));
    } catch (error) {
        console.error('❌ Profile error:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * PUT /auth/profile/:userId - Cập nhật profile
 */
export async function updateProfile(req, res) {
    try {
        const { userId } = req.params || req.user;
        const { HoTen, SDT, DiaChi, GioiTinh } = req.body;

        // Verify user can only update their own profile or they are admin
        if (req.user.userId !== userId && req.user.vaiTro !== 'Admin') {
            return res.status(403).json(handleErrorResponse(403, 'Bạn không có quyền cập nhật profile này'));
        }

        const user = await accountModel.getAccountById(userId);
        if (!user) {
            return res.status(404).json(handleErrorResponse(404, 'Người dùng không tồn tại'));
        }

        await accountModel.updateAccount(userId, {
            HoTen: HoTen || user.HOTEN,
            SDT: SDT !== undefined ? SDT : user.SDT,
            DiaChi: DiaChi !== undefined ? DiaChi : user.DIACHI,
            VaiTro: user.VAITRO,
            GioiTinh: GioiTinh || user.GIOITINH
        });

        return res.status(200).json(handleSuccessResponse(200, 'Cập nhật profile thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}
