import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLayout } from '../../contexts/LayoutContext'; // Import hook để dùng context

const GiaoVienDashboard = () => {
  // Lấy hàm setPageTitle từ context
  const { setPageTitle } = useLayout();

  // Dùng useEffect để đặt tiêu đề ngay khi component được render
  useEffect(() => {
    // Đặt lại tiêu đề cho đúng với vai trò hiện tại
    setPageTitle("Bảng điều khiển (Giáo Viên)");
  }, [setPageTitle]); // Dependency array để đảm bảo chỉ chạy một lần

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Chào mừng đến với Dashboard Giáo Viên</Card.Title>
              <Card.Text>
                Đây là khu vực chức năng dành cho Giáo Viên. Các tính năng như quản lý điểm, lịch dạy, v.v. sẽ được xây dựng ở đây.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GiaoVienDashboard;