// src/components/HomeRedirect.jsx
import { ACCESS_TOKEN, USER_ROLE } from "../constants";
import { Navigate } from "react-router-dom";

const HomeRedirect = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const role = localStorage.getItem(USER_ROLE);

  if (!token) return <Navigate to="/login" />;

  switch (role) {
    case "BGH":
      return <Navigate to="/bgh" />;
    case "GiaoVu":
      return <Navigate to="/giaovu" />;
    case "GiaoVien":
      return <Navigate to="/giaovien" />;
    default:
      return <Navigate to="/unauthorized" />;
  }
};

export default HomeRedirect;
