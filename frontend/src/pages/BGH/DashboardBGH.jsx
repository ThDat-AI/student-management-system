"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap"
import { FaUsers, FaChartBar, FaCog, FaUserFriends, FaChalkboardTeacher, FaUserShield, FaUserTie } from "react-icons/fa"
import { useLayout } from "../../contexts/LayoutContext"
import api from "../../api"

// Component con cho các thẻ thống kê
const StatCard = ({ icon, title, value, color, loading }) => (
  <Card className="stat-card shadow-sm border-0 h-100">
    <Card.Body className="p-3">
      <div className="d-flex align-items-center">
        <div className={`stat-icon p-3 bg-${color} bg-opacity-10 rounded-3 me-3`}>
          {React.cloneElement(icon, { size: 24, className: `text-${color}` })}
        </div>
        <div className="flex-grow-1">
          <p className="text-muted mb-1 small fw-medium">{title}</p>
          <h3 className="mb-0 fw-bold text-dark">
            {loading ? <Spinner animation="border" size="sm" /> : value || "0"}
          </h3>
        </div>
      </div>
    </Card.Body>
  </Card>
)

const BGHDashboard = () => {
  const navigate = useNavigate()
  const { setPageTitle } = useLayout()

  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    setPageTitle("Bảng điều khiển (Ban giám hiệu)")

    const fetchStats = async () => {
      try {
        const response = await api.get("/api/thongke/dashboard/")
        setStats(response.data)
      } catch (error) {
        console.error("Không thể tải dữ liệu thống kê:", error)
        setStats({ total_accounts: "--", teacher_accounts: "--", giaovu_accounts: "--", bgh_accounts: "--" })
      } finally {
        setLoadingStats(false)
      }
    }

    fetchStats()
  }, [setPageTitle])

  const menuItems = [
    { title: "Quản lý tài khoản", description: "Tạo, sửa, xóa các tài khoản trong hệ thống.", icon: <FaUsers />, color: "primary", path: "/bgh/taikhoan" },
    { title: "Báo cáo & Thống kê", description: "Xem các báo cáo tổng quan về học tập và hệ thống.", icon: <FaChartBar />, color: "success", path: "/bgh/baocao" },
    { title: "Cài đặt hệ thống", description: "Cấu hình các thông số chung của năm học, quy định.", icon: <FaCog />, color: "warning", path: "/bgh/caidat" },
  ]

  const quickStats = [
    { icon: <FaUserFriends />, title: "Tổng tài khoản", value: stats?.total_accounts, color: "primary" },
    { icon: <FaChalkboardTeacher />, title: "Giáo viên", value: stats?.teacher_accounts, color: "success" },
    { icon: <FaUserShield />, title: "Giáo vụ", value: stats?.giaovu_accounts, color: "info" },
    { icon: <FaUserTie />, title: "Ban giám hiệu", value: stats?.bgh_accounts, color: "danger" },
  ]

  return (
    <div className="dashboard-container">
      <Container fluid className="px-0 py-0">
        <Row className="g-0">
          <Col className="content-area px-4 py-4">
            
            {/* Banner chào mừng - ĐÃ SỬA LẠI */}
            <div className="welcome-banner p-4 rounded-4 position-relative overflow-hidden mb-4">
              <div className="welcome-content">
                <div className="d-flex align-items-center">
                  {/* Avatar Section - Bên trái */}
                  <div className="banner-avatar-section me-4">
                    <div className="avatar-container">
                      <div className="avatar-main">
                        <div className="avatar-placeholder">
                          <FaUserTie size={32} className="text-white" />
                        </div>
                      </div>
                      <div className="avatar-ring"></div>
                      <div className="avatar-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Text content - Bên phải */}
                  <div className="flex-grow-1">
                    <h2 className="text-white mb-1 fw-bold">Chào mừng, Ban Giám Hiệu!</h2>
                    <p className="text-white-75 mb-0">Quản lý và giám sát hoạt động của hệ thống một cách hiệu quả</p>
                  </div>
                </div>
              </div>
              <div className="banner-pattern"></div>
            </div>

            {/* Chức năng chính */}
            <div className="mb-5">
              <h5 className="fw-bold text-dark mb-3 border-start border-primary border-4 ps-2">Chức năng chính</h5>
              <Row className="g-4">
                {menuItems.map((item, index) => (
                  <Col xs={12} md={6} xl={4} key={index}>
                    <Card className="function-card h-100 border-0 shadow-sm" onClick={() => navigate(item.path)}>
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className={`function-icon p-3 bg-${item.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center`}>
                            {React.cloneElement(item.icon, { size: 24, className: `text-${item.color}` })}
                          </div>
                          <h5 className="fw-bold mb-0 ms-3">{item.title}</h5>
                        </div>
                        <p className="text-muted mb-3 lh-base">{item.description}</p>
                        <div className="text-end">
                          <Button variant={item.color} size="sm" className="px-3 rounded-pill" onClick={(e) => { e.stopPropagation(); navigate(item.path); }}>
                            Truy cập ngay
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Thống kê tổng quan */}
            <div>
              <h5 className="fw-bold text-dark mb-3 border-start border-primary border-4 ps-2">Thống kê tổng quan</h5>
              <Row className="g-3">
                {quickStats.map((stat, index) => (
                  <Col xs={12} sm={6} lg={3} key={index}>
                    <StatCard {...stat} loading={loadingStats} />
                  </Col>
                ))}
              </Row>
            </div>

          </Col>
        </Row>
      </Container>

      {/* Enhanced CSS Styles - ĐÃ SỬA */}
      <style type="text/css">
        {`
          .dashboard-container { 
            background-color: #f8f9fa; 
            min-height: calc(100vh - 56px); 
          }
          
          .content-area { 
            padding-top: 1.5rem; 
          }

          /* BANNER - ĐÃ SỬA HOÀN TOÀN */
          .welcome-banner { 
            background: linear-gradient(135deg, #3a36db 0%, #4361ee 100%); 
            box-shadow: 0 10px 20px rgba(67, 97, 238, 0.15);
            border-radius: 16px;
            position: relative;
            overflow: hidden;
          }
          
          .welcome-content {
            position: relative;
            z-index: 10;
          }
          
          .banner-pattern {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background-image: 
              radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), 
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
            opacity: 0.3;
            z-index: 1;
          }

          .welcome-banner h2, 
          .welcome-banner p {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            position: relative;
            z-index: 10;
          }
          
          .text-white-75 {
            color: rgba(255, 255, 255, 0.85) !important;
          }
          
          .welcome-icon { 
            width: 56px; 
            height: 56px;
            position: relative;
            z-index: 10;
            backdrop-filter: blur(10px);
          }

          /* AVATAR SECTION */
          .banner-avatar-section {
            position: relative;
            z-index: 10;
          }

          .avatar-container {
            position: relative;
            width: 80px;
            height: 80px;
          }

          .avatar-main {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 64px;
            height: 64px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 50%;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3;
          }

          .avatar-placeholder {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          }

          .avatar-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 72px;
            height: 72px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.4);
            z-index: 2;
            animation: avatarRotate 8s linear infinite;
          }

          .avatar-pulse {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            z-index: 1;
            animation: avatarPulse 3s ease-in-out infinite;
          }

          @keyframes avatarRotate {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }

          @keyframes avatarPulse {
            0%, 100% { 
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.3;
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.1);
              opacity: 0.1;
            }
          }
          
          /* STAT CARDS */
          .stat-card { 
            transition: all 0.3s ease; 
            border-radius: 12px; 
            overflow: hidden; 
            border-bottom: 3px solid transparent; 
          }
          
          .stat-card:hover { 
            transform: translateY(-3px); 
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important; 
          }
          
          .stat-card:nth-child(1):hover { border-bottom-color: var(--bs-primary); }
          .stat-card:nth-child(2):hover { border-bottom-color: var(--bs-success); }
          .stat-card:nth-child(3):hover { border-bottom-color: var(--bs-info); }
          .stat-card:nth-child(4):hover { border-bottom-color: var(--bs-danger); }

          .stat-card .stat-icon { 
            transition: transform 0.3s ease; 
          }
          
          .stat-card:hover .stat-icon { 
            transform: scale(1.1); 
          }

          /* FUNCTION CARDS */
          .function-card { 
            cursor: pointer; 
            transition: all 0.3s ease; 
            position: relative; 
            overflow: hidden; 
            border-radius: 12px; 
          }
          
          .function-card::after { 
            content: ''; 
            position: absolute; 
            bottom: 0; 
            left: 0; 
            width: 0; 
            height: 3px; 
            transition: width 0.3s ease; 
          }
          
          .function-card:nth-child(1)::after { background-color: var(--bs-primary); }
          .function-card:nth-child(2)::after { background-color: var(--bs-success); }
          .function-card:nth-child(3)::after { background-color: var(--bs-warning); }

          .function-card:hover::after { 
            width: 100%; 
          }
          
          .function-card:hover { 
            transform: translateY(-5px); 
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1) !important; 
          }
          
          .function-icon { 
            width: 48px; 
            height: 48px; 
            transition: all 0.3s ease; 
          }
          
          .function-card:hover .function-icon { 
            transform: scale(1.1); 
          }

          /* RESPONSIVE */
          @media (max-width: 768px) { 
            .welcome-banner .d-flex { 
              flex-direction: column; 
              align-items: center;
              text-align: center;
            } 
            
            .banner-avatar-section {
              margin-bottom: 1rem;
              margin-right: 0 !important;
            }

            .avatar-container {
              width: 60px;
              height: 60px;
            }

            .avatar-main {
              width: 48px;
              height: 48px;
            }

            .avatar-ring {
              width: 54px;
              height: 54px;
            }

            .avatar-pulse {
              width: 60px;
              height: 60px;
            }
          }

          @media (max-width: 992px) {
            .avatar-container {
              width: 70px;
              height: 70px;
            }

            .avatar-main {
              width: 56px;
              height: 56px;
            }

            .avatar-ring {
              width: 64px;
              height: 64px;
            }

            .avatar-pulse {
              width: 70px;
              height: 70px;
            }
          }
        `}
      </style>
    </div>
  )
}

export default BGHDashboard