import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaFileExport, FaClipboardList } from "react-icons/fa";
import { useLayout } from "../../contexts/LayoutContext";
import "../../assets/styles/BGHDashboard.css";

const QuanLyDiemBGHWrapper = () => {
  const navigate = useNavigate();
  const { setPageTitle } = useLayout();

  useEffect(() => {
    setPageTitle("Quản lý điểm - Ban Giám Hiệu");
  }, [setPageTitle]);

  const menuItems = [
    {
      title: "Xuất báo cáo điểm",
      description: "Tạo và tải báo cáo điểm toàn trường theo lớp, khối, học kỳ.",
      icon: <FaFileExport />,
      color: "secondary",
      path: "/bgh/xuat-bao-cao",
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
                    <FaClipboardList size={32} className="text-white avatar-icon" />
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
              <h2 className="text-white mb-1 fw-bold banner-title">Quản lý điểm toàn trường</h2>
              <p className="text-white-75 mb-0 banner-subtitle">Chọn chức năng để tiếp tục</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="mb-5">
          <h5 className="fw-bold text-dark mb-3 border-start border-secondary border-4 ps-2">
            Chức năng quản lý điểm
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
      </Container>
    </div>
  );
};

export default QuanLyDiemBGHWrapper;
