import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Dùng context để lấy token và role

const ProtectedRoute = ({ allowedRoles }) => {
  // Lấy thông tin từ AuthContext thay vì localStorage trực tiếp
  const { token, user } = useAuth();
  const role = user?.MaVaiTro?.MaVaiTro;

  // 1. Kiểm tra đã đăng nhập chưa (dựa vào token)
  if (!token) {
    // Luôn thêm `replace` để người dùng không thể nhấn nút Back quay lại trang cũ
    return <Navigate to="/login" replace />;
  }

  // 2. Kiểm tra quyền hạn
  // Nếu route này không yêu cầu quyền cụ thể (allowedRoles rỗng hoặc không có)
  // thì chỉ cần đăng nhập là được vào.
  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  // Nếu route yêu cầu quyền, kiểm tra xem role của user có trong danh sách cho phép không
  if (allowedRoles.includes(role)) {
    return <Outlet />;
  }

  // 3. Nếu có token nhưng không có quyền -> trang Unauthorized
  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;