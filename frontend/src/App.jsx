import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from "./contexts/AuthContext";
import { LayoutProvider } from "./contexts/LayoutContext";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import HomeRedirect from "./components/HomeRedirect";

import Login from "./pages/Common/Login";
import NotFound from "./pages/Common/NotFound";
import Unauthorized from "./pages/Common/Unauthorized";
import BGHDashboard from "./pages/BGH/BGHDashboard";
import AccountManagement from "./pages/BGH/AccountManagement/AccountManagement";
import QuyDinhManagement from "./pages/BGH/QuyDinhManagement";
import LopHocManagement from "./pages/GiaoVu/LopHocManagement";
import GiaoVuDashboard from "./pages/GiaoVu/GiaoVuDashboard";
import LapDanhSachLop from "./pages/GiaoVu/LapDanhSachLop";
import GiaoVienDashboard from "./pages/GiaoVien/GiaoVienDashboard";

import PasswordResetRequest from "./pages/Common/PasswordResetRequest";
import PasswordResetConfirm from "./pages/Common/PasswordResetConfirm";

import QuanLyDiemGV from "./pages/GiaoVien/QuanLyDiemGV";
import TongHopDiemGV from "./pages/GiaoVien/TongHopDiemGV";
import XuatBaoCaoGV from "./pages/GiaoVien/XuatBaoCaoGV";

import TongHopDiemGVu from "./pages/GiaoVu/TongHopDiemGVu";
import XuatBaoCaoGVu from "./pages/GiaoVu/XuatBaoCaoGVu";

import XuatBaoCaoBGH from "./pages/BGH/XuatBaoCaoBGH";

function App() {
  return (
    <Router>
      <AuthProvider>
        <LayoutProvider>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/password-reset" element={<PasswordResetRequest />} />
              <Route path="/password-reset/confirm" element={<PasswordResetConfirm />} />
            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route path="/" element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route index element={<HomeRedirect />} />

                {/* BGH Routes */}
                <Route element={<ProtectedRoute allowedRoles={["BGH"]} />}>
                  <Route path="bgh" element={<BGHDashboard />} />
                  <Route path="bgh/taikhoan" element={<AccountManagement />} />
                  <Route path="bgh/quydinh" element={<QuyDinhManagement />} />
                  <Route path="bgh/lophoc" element={<LopHocManagement />} />
                  <Route path="bgh/xuat-bao-cao" element={<XuatBaoCaoBGH />} />
                </Route>

                {/* Giao Vu Routes */}
                <Route element={<ProtectedRoute allowedRoles={["GiaoVu"]} />}>
                  <Route path="giaovu" element={<GiaoVuDashboard />} />
                  <Route path="giaovu/quan-ly-lop-hoc" element={<LopHocManagement />} />
                  <Route path="giaovu/lap-danh-sach-lop" element={<LapDanhSachLop />} />
                  <Route path="giaovu/tong-hop-diem" element={<TongHopDiemGVu />} />
                  <Route path="giaovu/xuat-bao-cao" element={<XuatBaoCaoGVu />} />
                </Route>

                {/* Giao Vien Routes */}
                <Route element={<ProtectedRoute allowedRoles={["GiaoVien"]} />}>
                  <Route path="giaovien" element={<GiaoVienDashboard />} />
                  <Route path="giaovien/quan-ly-diem" element={<QuanLyDiemGV />} />
                  <Route path="giaovien/tong-hop-diem" element={<TongHopDiemGV />} />
                  <Route path="giaovien/xuat-bao-cao" element={<XuatBaoCaoGV />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </LayoutProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
