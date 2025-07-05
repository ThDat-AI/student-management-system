import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { LayoutProvider } from "./contexts/LayoutContext";

// Layouts & Route Guards
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import HomeRedirect from "./components/HomeRedirect";

// Common Pages
import Login from "./pages/Common/Login";
import NotFound from "./pages/Common/NotFound";
import Unauthorized from "./pages/Common/Unauthorized";
import PasswordResetRequest from "./pages/Common/PasswordResetRequest";
import PasswordResetConfirm from "./pages/Common/PasswordResetConfirm";

// ======================= BGH Pages =======================
import BGHDashboard from "./pages/BGH/BGHDashboard";
import AccountManagement from "./pages/BGH/AccountManagement/AccountManagement";
import QuyDinhManagement from "./pages/BGH/QuyDinhManagement";
import LopHocManagement from "./pages/GiaoVu/LopHocManagement"; // dùng chung với giáo vụ
import TongHopDiemBGH from "./pages/BGH/TongHopDiemBGH";
import QuanLyDiemBGHWrapper from "./pages/BGH/QuanLyDiemBGHWrapper"; // ✅ wrapper quản lý điểm cho BGH

// ======================= Giáo vụ Pages =======================
import GiaoVuDashboard from "./pages/GiaoVu/GiaoVuDashboard";
import LapDanhSachLop from "./pages/GiaoVu/LapDanhSachLop";
import QuanLyDiemGVuWrapper from "./pages/GiaoVu/QuanLyDiemGVuWrapper";
import TongHopDiemGVu from "./pages/GiaoVu/TongHopDiemGVu";
import XuatBaoCaoGVu from "./pages/GiaoVu/XuatBaoCaoGVu";

// ======================= Giáo viên Pages =======================
import GiaoVienDashboard from "./pages/GiaoVien/GiaoVienDashboard";
import QuanLyDiemGVWrapper from "./pages/GiaoVien/QuanLyDiemGVWrapper";
import QuanLyDiemGV from "./pages/GiaoVien/QuanLyDiemGV";
import TongHopDiemGV from "./pages/GiaoVien/TongHopDiemGV";

function App() {
  return (
    <Router>
      <AuthProvider>
        <LayoutProvider>
          <Routes>

            {/* ----------- Routes dành cho người chưa đăng nhập (guest) ----------- */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/password-reset" element={<PasswordResetRequest />} />
              <Route path="/password-reset/confirm" element={<PasswordResetConfirm />} />
            </Route>

            {/* ----------- Trang báo lỗi không có quyền ----------- */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ----------- Routes dành cho người đã đăng nhập ----------- */}
            <Route path="/" element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                {/* Điều hướng trang chủ dựa vào vai trò người dùng */}
                <Route index element={<HomeRedirect />} />

                {/* =================== BGH Routes =================== */}
                <Route element={<ProtectedRoute allowedRoles={["BGH"]} />}>
                  <Route path="bgh" element={<BGHDashboard />} />
                  <Route path="bgh/taikhoan" element={<AccountManagement />} />
                  <Route path="bgh/quydinh" element={<QuyDinhManagement />} />
                  <Route path="bgh/lophoc" element={<LopHocManagement />} />
                  <Route path="bgh/quan-ly-diem" element={<QuanLyDiemBGHWrapper />} /> {/* ✅ gộp quản lý điểm */}
                  <Route path="bgh/xuat-bao-cao" element={<TongHopDiemBGH />} /> {/* dùng trong wrapper */}
                </Route>

                {/* =================== Giáo vụ Routes =================== */}
                <Route element={<ProtectedRoute allowedRoles={["GiaoVu"]} />}>
                  <Route path="giaovu" element={<GiaoVuDashboard />} />
                  <Route path="giaovu/quan-ly-lop-hoc" element={<LopHocManagement />} />
                  <Route path="giaovu/lap-danh-sach-lop" element={<LapDanhSachLop />} />
                  <Route path="giaovu/quan-ly-diem" element={<QuanLyDiemGVuWrapper />} />
                  <Route path="giaovu/quan-ly-diem/tong-hop" element={<TongHopDiemGVu />} />
                  <Route path="giaovu/quan-ly-diem/xuat-bao-cao" element={<XuatBaoCaoGVu />} />
                </Route>

                {/* =================== Giáo viên Routes =================== */}
                <Route element={<ProtectedRoute allowedRoles={["GiaoVien"]} />}>
                  <Route path="giaovien" element={<GiaoVienDashboard />} />
                  <Route path="giaovien/quan-ly-diem" element={<QuanLyDiemGVWrapper />} />
                  <Route path="giaovien/quan-ly-diem/nhap" element={<QuanLyDiemGV />} />
                  <Route path="giaovien/quan-ly-diem/tong-hop" element={<TongHopDiemGV />} />
                </Route>
              </Route>
            </Route>

            {/* ----------- Trang không tìm thấy (404) ----------- */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </LayoutProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
