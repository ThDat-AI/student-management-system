import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Import các context
import { AuthProvider } from "./contexts/AuthContext";
import { LayoutProvider } from "./contexts/LayoutContext";

// Import các components và layouts
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute"; // THAY THẾ AuthWrapper BẰNG GuestRoute
import MainLayout from "./layouts/MainLayout";
import HomeRedirect from "./components/HomeRedirect";

// Import các trang
import Login from "./pages/Common/Login";
import BGHDashboard from "./pages/BGH/DashboardBGH";
import AccountManagement from "./pages/BGH/AccountManagement";
import GiaoVuDashboard from "./pages/GiaoVu/DashboardGiaoVu";
import GiaoVienDashboard from "./pages/GiaoVien/DashboardGiaoVien";
import NotFound from "./pages/Common/NotFound";
import Unauthorized from "./pages/Common/Unauthorized";


function App() {
  return (
    <Router>
      <AuthProvider>
        <LayoutProvider>
          <Routes>
            {/* CÁC ROUTE DÀNH CHO KHÁCH (CHƯA ĐĂNG NHẬP) */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              {/* Nếu có trang đăng ký, bạn có thể đặt nó ở đây */}
              {/* <Route path="/register" element={<Register />} /> */}
            </Route>
            
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* CÁC ROUTE YÊU CẦU PHẢI ĐĂNG NHẬP */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomeRedirect />} />
                
                {/* Lớp bảo vệ 2: Yêu cầu vai trò cụ thể */}
                <Route element={<ProtectedRoute allowedRoles={["BGH"]} />}>
                  <Route path="/bgh" element={<BGHDashboard />} />
                  <Route path="/bgh/taikhoan" element={<AccountManagement />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["GiaoVu"]} />}>
                  <Route path="/giaovu" element={<GiaoVuDashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["GiaoVien"]} />}>
                  <Route path="/giaovien" element={<GiaoVienDashboard />} />
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