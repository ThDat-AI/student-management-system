import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GuestRoute = () => {
  // Lấy token từ AuthContext để kiểm tra trạng thái đăng nhập
  const { token } = useAuth();

  // Nếu có token (đã đăng nhập), điều hướng về trang chủ '/'
  // HomeRedirect sẽ lo việc chuyển đến dashboard tương ứng
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Nếu chưa đăng nhập, cho phép render các route con (ví dụ: trang Login)
  return <Outlet />;
};

export default GuestRoute;