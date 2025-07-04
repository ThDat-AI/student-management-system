import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import {
  FaUsers,
  FaChartBar,
  FaCog,
  FaUserFriends,
  FaChalkboardTeacher,
  FaUserShield,
  FaUserTie,
  FaClipboardList, // 🔄 dùng thay FaFileExport
} from "react-icons/fa";
import { useLayout } from "../../contexts/LayoutContext";
import api from "../../api";
import "../../assets/styles/BGHDashboard.css";

const StatCard = ({ icon, title, value, color, loading }) => (
  <Card className="stat-card shadow-sm border-0 h-100">
    <Card.Body className="p-3">
      <div className="d-flex align-items-center">
        <div className={`stat-icon p-3 bg-${color} bg-opacity-10 rounded-3 me-3`}>
          {React.cloneElement(icon, { size: 24, className: `text-${color}` })}
        </div>
        <div>
          <p className="text-muted mb-1 small fw-medium">{title}</p>
          <h3 className="mb-0 fw-bold text-dark">
            {loading ? <Spinner animation="border" size="sm" /> : value ?? "0"}
          </h3>
        </div>
      </div>
    </Card.Body>
  </Card>
);

const BGHDashboard = () => {
  const navigate = useNavigate();
  const { setPageTitle } = useLayout();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    setPageTitle("Bảng điều khiển (Ban giám hiệu)");
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/accounts/dashboard-stats/");
        setStats(response.data);
      } catch (error) {
        console.error("Không thể tải dữ liệu thống kê:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [setPageTitle]);

  const menuItems = [
    {
      title: "Quản lý tài khoản",
      description: "Tạo, sửa, xóa các tài khoản trong hệ thống.",
      icon: <FaUsers />,
      color: "primary",
      path: "/bgh/taikhoan",
    },
    {
      title: "Báo cáo & Thống kê",
      description: "Xem các báo cáo tổng quan về học tập và hệ thống.",
      icon: <FaChartBar />,
      color: "success",
      path: "/bgh/baocao",
    },
    {
      title: "Cài đặt hệ thống",
      description: "Cấu hình các thông số chung của năm học, quy định.",
      icon: <FaCog />,
      color: "warning",
      path: "/bgh/quydinh",
    },
    {
      title: "Quản lý lớp học",
      description: "Thêm, xoá lớp học và quản lý khối, tổ hợp, niên khóa.",
      icon: <FaChalkboardTeacher />,
      color: "info",
      path: "/bgh/lophoc",
    },
    {
      title: "Quản lý điểm", // 🔄 thay vì "Xuất báo cáo điểm"
      description: "Xuất báo cáo điểm toàn trường theo lớp, khối, học kỳ.",
      icon: <FaClipboardList />, // 🔄 thay FaFileExport
      color: "secondary",
      path: "/bgh/quan-ly-diem", // 🔄 trỏ tới trang mới
    },
  ];

  const quickStats = [
    {
      icon: <FaUserFriends />,
      title: "Tổng tài khoản",
      value: stats?.total_accounts,
      color: "primary",
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Giáo viên",
      value: stats?.teacher_accounts,
      color: "success",
    },
    {
      icon: <FaUserShield />,
      title: "Giáo vụ",
      value: stats?.giaovu_accounts,
      color: "info",
    },
    {
      icon: <FaUserTie />,
      title: "Ban giám hiệu",
      value: stats?.bgh_accounts,
      color: "danger",
    },
  ];

  return (
    <div className="dashboard-container">
      <Container fluid className="px-4 py-4">
        {/* Banner */}
        <div className="welcome-banner p-4 rounded-4 position-relative overflow-hidden mb-4">
          <div className="banner-bg-animation">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`floating-orb orb-${i + 1}`}></div>
            ))}
          </div>
          <div className="grid-pattern"></div>
          <div className="wave-animation">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`wave wave-${i}`}></div>
            ))}
          </div>
          <div className="particles">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`particle particle-${i}`}></div>
            ))}
          </div>
          <div className="shimmer-effect"></div>
          <div className="welcome-content d-flex align-items-center">
            <div className="banner-avatar-section me-4">
              <div className="avatar-container">
                <div className="avatar-main">
                  <div className="avatar-placeholder">
                    <FaUserTie size={32} className="text-white avatar-icon" />
                  </div>
                </div>
                <div className="avatar-ring ring-1"></div>
                <div className="avatar-ring ring-2"></div>
                <div className="avatar-pulse pulse-1"></div>
                <div className="avatar-pulse pulse-2"></div>
                <div className="avatar-glow"></div>
              </div>
            </div>
            <div>
              <h2 className="text-white mb-1 fw-bold banner-title">
                Chào mừng, Ban Giám Hiệu!
              </h2>
              <p className="text-white-75 mb-0 banner-subtitle">
                Quản lý và giám sát hoạt động của hệ thống một cách hiệu quả
              </p>
            </div>
          </div>
        </div>

        {/* Chức năng chính */}
        <div className="mb-5">
          <h5 className="fw-bold text-dark mb-3 border-start border-primary border-4 ps-2">
            Chức năng chính
          </h5>
          <Row className="g-4">
            {menuItems.map((item, index) => (
              <Col xs={12} md={6} xl={4} key={index}>
                <Card
                  className="function-card h-100 border-0 shadow-sm"
                  onClick={() => navigate(item.path)}
                >
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className={`function-icon p-3 bg-${item.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center`}
                      >
                        {React.cloneElement(item.icon, {
                          size: 24,
                          className: `text-${item.color}`,
                        })}
                      </div>
                      <h5 className="fw-bold mb-0 ms-3">{item.title}</h5>
                    </div>
                    <p className="text-muted mb-3 lh-base flex-grow-1">
                      {item.description}
                    </p>
                    <div className="text-end mt-auto">
                      <Button
                        variant={item.color}
                        size="sm"
                        className="px-3 rounded-pill"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(item.path);
                        }}
                      >
                        Truy cập
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Thống kê nhanh */}
        <div>
          <h5 className="fw-bold text-dark mb-3 border-start border-primary border-4 ps-2">
            Thống kê tổng quan
          </h5>
          <Row className="g-3">
            {quickStats.map((stat, index) => (
              <Col xs={12} sm={6} lg={3} key={index}>
                <StatCard {...stat} loading={loadingStats} />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default BGHDashboard;
