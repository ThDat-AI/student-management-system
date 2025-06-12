// src/components/SharedNavbar.jsx

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import thêm Link
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { FaUserTie, FaArrowLeft, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

// Component nhận vào user object, trong đó có Ho và Ten
const SharedNavbar = ({ pageTitle, user, dashboardPath, onLogout, onProfileClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem trang hiện tại có phải là trang dashboard chính không
  const onDashboardPage = location.pathname === dashboardPath;
  
  // Tạo chuỗi chào mừng
  const welcomeMessage = user ? `Xin chào, ${user.Ho} ${user.Ten}` : "Người dùng";

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        {/* BƯỚC 1: Bọc Navbar.Brand trong Link */}
        <Link to={dashboardPath || '/'} className="navbar-brand">
          <FaUserTie className="me-2" />
          {pageTitle || 'Bảng điều khiển'}
        </Link>
        
        <Nav className="ms-auto d-flex flex-row align-items-center">
          {/* Nút "Về Dashboard" chỉ hiện khi không ở trang dashboard */}
          {!onDashboardPage && dashboardPath && (
            <Button variant="outline-light" onClick={() => navigate(dashboardPath)} className="me-3 d-none d-sm-block">
              <FaArrowLeft className="me-1" />
              Về Dashboard
            </Button>
          )}
          
          <Dropdown align="end">
            <Dropdown.Toggle variant="outline-light" id="dropdown-user" className="d-flex align-items-center">
              <FaUserCircle className="me-2" />
              {/* BƯỚC 2: Hiển thị tên đầy đủ */}
              {user ? `${user.Ho} ${user.Ten}` : "Tài khoản"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {/* Hiển thị lời chào trong Dropdown */}
              <Dropdown.Header>{welcomeMessage}</Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onProfileClick}>
                <FaUserCircle className="me-2" />
                Thông tin cá nhân
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onLogout} className="text-danger">
                <FaSignOutAlt className="me-2" />
                Đăng xuất
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default SharedNavbar;