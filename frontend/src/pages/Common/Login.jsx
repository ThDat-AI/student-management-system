import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // BƯỚC 1: IMPORT useNavigate
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaSchool } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';

// Hàm tiện ích để lấy đường dẫn dashboard
const getDashboardPath = (role) => {
  switch (role) {
    case 'BGH': return '/bgh';
    case 'GiaoVien': return '/giaovien';
    case 'GiaoVu': return '/giaovu';
    default: return '/'; // Mặc định về trang chủ chung
  }
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate(); // BƯỚC 2: KHỞI TẠO useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Lấy token
      const tokenResponse = await api.post("/api/token/", { username, password });
      const accessToken = tokenResponse.data.access;
      const refreshToken = tokenResponse.data.refresh;

      // Thiết lập header cho các request tiếp theo
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Lấy thông tin chi tiết người dùng
      const profileResponse = await api.get('/api/taikhoan/me/');
      const userData = profileResponse.data;
      
      // Cập nhật state toàn cục qua context
      login(userData, accessToken, refreshToken);

      // BƯỚC 3: ĐIỀU HƯỚNG NGAY SAU KHI ĐĂNG NHẬP THÀNH CÔNG
      const userRole = userData?.MaVaiTro?.MaVaiTro;
      const path = getDashboardPath(userRole);
      
      // Dùng { replace: true } để người dùng không thể nhấn nút "Back" quay lại trang login
      navigate(path, { replace: true });
      
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Tên đăng nhập hoặc mật khẩu không chính xác.");
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
      console.error("Lỗi đăng nhập:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <FaSchool size={40} className="text-primary mb-3" />
                <h2 className="fw-bold">Đăng nhập hệ thống</h2>
                <p className="text-muted">Chào mừng trở lại!</p>
              </div>
              
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control type="text" placeholder="Nhập tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading}/>
                </Form.Group>
                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control type="password" placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}/>
                </Form.Group>
                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={loading} size="lg">
                    {loading ? (<><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> <span className="ms-2">Đang xử lý...</span></>) : ('Đăng nhập')}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;