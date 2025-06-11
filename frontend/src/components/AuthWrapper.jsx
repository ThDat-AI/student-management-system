// src/components/AuthWrapper.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN, USER_ROLE } from "../constants";
import { Container } from "react-bootstrap";

const AuthWrapper = ({ children, redirectIfLoggedIn = false }) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const role = localStorage.getItem(USER_ROLE);

    if (token && role && redirectIfLoggedIn) {
      // Nếu đã đăng nhập và component yêu cầu redirect
      let path = "";
      switch (role) {
        case "BGH":
          path = "/bgh";
          break;
        case "GiaoVu":
          path = "/giaovu";
          break;
        case "GiaoVien":
          path = "/giaovien";
          break;
        default:
          path = "/unauthorized";
          break;
      }
      setRedirectPath(path);
      setShouldRedirect(true);
    }
    
    setIsCheckingAuth(false);
  }, [redirectIfLoggedIn]);

  if (isCheckingAuth) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Đang kiểm tra...</p>
        </div>
      </Container>
    );
  }

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default AuthWrapper;