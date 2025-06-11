// src/components/SharedNavbar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { FaUserTie, FaArrowLeft, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

// Prop giờ nhận cả object 'user'
const SharedNavbar = ({ pageTitle, user, dashboardPath, onLogout, onProfileClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const onDashboardPage = location.pathname === dashboardPath;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand>
          <FaUserTie className="me-2" />
          {pageTitle || 'Bảng điều khiển'}
        </Navbar.Brand>
        
        <Nav className="ms-auto d-flex flex-row align-items-center">
          {!onDashboardPage && (
            <Button variant="outline-light" onClick={() => navigate(dashboardPath)} className="me-3">
              <FaArrowLeft className="me-1" />
              Về Dashboard
            </Button>
          )}
          
          <Dropdown align="end">
            <Dropdown.Toggle variant="outline-light" id="dropdown-user">
              {/* HIỂN THỊ TÊN NGƯỜI DÙNG */}
              {user ? `Xin chào, ${user.Ten}` : "Người dùng"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
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