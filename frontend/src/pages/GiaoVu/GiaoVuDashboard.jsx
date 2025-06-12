import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLayout } from '../../contexts/LayoutContext';

const GiaoVuDashboard = () => {
  const { setPageTitle } = useLayout();

  useEffect(() => {
    // Đặt lại tiêu đề cho đúng với vai trò Giáo Vụ
    setPageTitle("Bảng điều khiển (Giáo Vụ)");
  }, [setPageTitle]);

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Chào mừng đến với Dashboard Giáo Vụ</Card.Title>
              <Card.Text>
                Đây là khu vực chức năng dành cho Giáo Vụ. Các tính năng như quản lý lớp học, xếp thời khóa biểu, v.v. sẽ được xây dựng ở đây.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GiaoVuDashboard;