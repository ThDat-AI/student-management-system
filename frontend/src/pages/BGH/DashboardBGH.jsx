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
            
            {/* Enhanced Animated Banner */}
            <div className="welcome-banner p-4 rounded-4 position-relative overflow-hidden mb-4">
              {/* Animated Background Elements */}
              <div className="banner-bg-animation">
                <div className="floating-orb orb-1"></div>
                <div className="floating-orb orb-2"></div>
                <div className="floating-orb orb-3"></div>
                <div className="floating-orb orb-4"></div>
                <div className="floating-orb orb-5"></div>
              </div>
              
              {/* Animated Grid Pattern */}
              <div className="grid-pattern"></div>
              
              {/* Wave Animation */}
              <div className="wave-animation">
                <div className="wave wave-1"></div>
                <div className="wave wave-2"></div>
                <div className="wave wave-3"></div>
              </div>
              
              {/* Particle Effects */}
              <div className="particles">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
                <div className="particle particle-4"></div>
                <div className="particle particle-5"></div>
                <div className="particle particle-6"></div>
              </div>

              <div className="welcome-content">
                <div className="d-flex align-items-center">
                  {/* Enhanced Avatar Section */}
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
                  
                  {/* Enhanced Text content */}
                  <div className="flex-grow-1">
                    <h2 className="text-white mb-1 fw-bold banner-title">Chào mừng, Ban Giám Hiệu!</h2>
                    <p className="text-white-75 mb-0 banner-subtitle">Quản lý và giám sát hoạt động của hệ thống một cách hiệu quả</p>
                  </div>
                </div>
              </div>
              
              {/* Shimmer Effect */}
              <div className="shimmer-effect"></div>
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

      {/* Enhanced CSS Styles with Animations */}
      <style type="text/css">
        {`
          .dashboard-container { 
            background-color: #f8f9fa; 
            min-height: calc(100vh - 56px); 
          }
          
          .content-area { 
            padding-top: 1.5rem; 
          }

          /* ENHANCED ANIMATED BANNER */
          .welcome-banner { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
            border-radius: 20px;
            position: relative;
            overflow: hidden;
            animation: bannerGlow 4s ease-in-out infinite alternate;
          }

          @keyframes bannerGlow {
            0% { 
              box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
            }
            100% { 
              box-shadow: 0 25px 50px rgba(102, 126, 234, 0.4);
            }
          }
          
          .welcome-content {
            position: relative;
            z-index: 20;
            animation: slideInUp 1s ease-out;
          }

          @keyframes slideInUp {
            0% {
              transform: translateY(30px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          /* FLOATING ORBS */
          .banner-bg-animation {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
          }

          .floating-orb {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            animation: floatOrb 20s ease-in-out infinite;
          }

          .orb-1 {
            width: 80px;
            height: 80px;
            top: 10%;
            left: 5%;
            animation-delay: 0s;
          }

          .orb-2 {
            width: 60px;
            height: 60px;
            top: 60%;
            left: 80%;
            animation-delay: -5s;
          }

          .orb-3 {
            width: 40px;
            height: 40px;
            top: 20%;
            left: 70%;
            animation-delay: -10s;
          }

          .orb-4 {
            width: 50px;
            height: 50px;
            top: 80%;
            left: 10%;
            animation-delay: -15s;
          }

          .orb-5 {
            width: 30px;
            height: 30px;
            top: 40%;
            left: 50%;
            animation-delay: -7s;
          }

          @keyframes floatOrb {
            0%, 100% {
              transform: translateY(0px) translateX(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-20px) translateX(10px) rotate(90deg);
            }
            50% {
              transform: translateY(-40px) translateX(-10px) rotate(180deg);
            }
            75% {
              transform: translateY(-20px) translateX(-20px) rotate(270deg);
            }
          }

          /* GRID PATTERN */
          .grid-pattern {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 20px 20px;
            animation: gridMove 30s linear infinite;
            z-index: 2;
          }

          @keyframes gridMove {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(20px, 20px);
            }
          }

          /* WAVE ANIMATION */
          .wave-animation {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 3;
          }

          .wave {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 200%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            animation: waveMove 15s ease-in-out infinite;
          }

          .wave-1 {
            animation-delay: 0s;
          }

          .wave-2 {
            animation-delay: -5s;
          }

          .wave-3 {
            animation-delay: -10s;
          }

          @keyframes waveMove {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(50%);
            }
          }

          /* PARTICLE EFFECTS */
          .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 4;
          }

          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            animation: particleFloat 10s ease-in-out infinite;
          }

          .particle-1 {
            top: 20%;
            left: 10%;
            animation-delay: 0s;
          }

          .particle-2 {
            top: 40%;
            left: 20%;
            animation-delay: -2s;
          }

          .particle-3 {
            top: 60%;
            left: 30%;
            animation-delay: -4s;
          }

          .particle-4 {
            top: 30%;
            left: 80%;
            animation-delay: -6s;
          }

          .particle-5 {
            top: 70%;
            left: 70%;
            animation-delay: -8s;
          }

          .particle-6 {
            top: 50%;
            left: 90%;
            animation-delay: -3s;
          }

          @keyframes particleFloat {
            0%, 100% {
              transform: translateY(0px) scale(1);
              opacity: 0.6;
            }
            50% {
              transform: translateY(-30px) scale(1.2);
              opacity: 1;
            }
          }

          /* SHIMMER EFFECT */
          .shimmer-effect {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            animation: shimmer 3s ease-in-out infinite;
            z-index: 15;
          }

          @keyframes shimmer {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }

          /* ENHANCED AVATAR ANIMATIONS */
          .avatar-container {
            position: relative;
            width: 80px;
            height: 80px;
            z-index: 10;
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
            backdrop-filter: blur(15px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            animation: avatarBounce 2s ease-in-out infinite alternate;
          }

          @keyframes avatarBounce {
            0% {
              transform: translate(-50%, -50%) scale(1);
            }
            100% {
              transform: translate(-50%, -50%) scale(1.05);
            }
          }

          .avatar-icon {
            animation: iconRotate 4s ease-in-out infinite;
            transform-origin: center;
          }

          @keyframes iconRotate {
            0%, 100% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(10deg);
            }
          }

          .avatar-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.4);
          }

          .ring-1 {
            width: 72px;
            height: 72px;
            animation: ringRotate 8s linear infinite;
            z-index: 8;
          }

          .ring-2 {
            width: 84px;
            height: 84px;
            animation: ringRotate 12s linear infinite reverse;
            z-index: 7;
            border-style: dashed;
          }

          @keyframes ringRotate {
            0% {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }

          .avatar-pulse {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
          }

          .pulse-1 {
            width: 80px;
            height: 80px;
            animation: pulseEffect 3s ease-in-out infinite;
            z-index: 5;
          }

          .pulse-2 {
            width: 90px;
            height: 90px;
            animation: pulseEffect 3s ease-in-out infinite;
            animation-delay: 1.5s;
            z-index: 4;
          }

          @keyframes pulseEffect {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.3;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 0.1;
            }
          }

          .avatar-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            animation: glowEffect 4s ease-in-out infinite alternate;
            z-index: 3;
          }

          @keyframes glowEffect {
            0% {
              opacity: 0.3;
              transform: translate(-50%, -50%) scale(1);
            }
            100% {
              opacity: 0.6;
              transform: translate(-50%, -50%) scale(1.1);
            }
          }

          /* ENHANCED TEXT ANIMATIONS */
          .banner-title {
            animation: titleGlow 3s ease-in-out infinite alternate;
          }

          @keyframes titleGlow {
            0% {
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            100% {
              text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.2);
            }
          }

          .banner-subtitle {
            animation: slideInLeft 1s ease-out 0.5s both;
          }

          @keyframes slideInLeft {
            0% {
              transform: translateX(-30px);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .text-white-75 {
            color: rgba(255, 255, 255, 0.85) !important;
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

            .ring-1 {
              width: 54px;
              height: 54px;
            }

            .ring-2 {
              width: 64px;
              height: 64px;
            }

            .pulse-1 {
              width: 60px;
              height: 60px;
            }

            .pulse-2 {
              width: 70px;
              height: 70px;
            }

            .avatar-glow {
              width: 80px;
              height: 80px;
            }

            .floating-orb {
              display: none;
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

            .ring-1 {
              width: 64px;
              height: 64px;
            }

            .ring-2 {
              width: 74px;
              height: 74px;
            }

            .pulse-1 {
              width: 70px;
              height: 70px;
            }

            .pulse-2 {
              width: 80px;
              height: 80px;
            }

            .avatar-glow {
              width: 90px;
              height: 90px;
            }
          }

          /* PERFORMANCE OPTIMIZATION */
          .welcome-banner * {
            will-change: transform;
          }

          @media (prefers-reduced-motion: reduce) {
            .welcome-banner *,
            .welcome-banner *::before,
            .welcome-banner *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default BGHDashboard