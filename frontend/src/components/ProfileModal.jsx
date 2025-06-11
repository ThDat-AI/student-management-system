import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from '../api'; // Chú ý đường dẫn api

const ProfileModal = ({ show, onHide }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tự động fetch dữ liệu của người dùng khi modal được mở
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        // Giả sử bạn có endpoint này để lấy thông tin của user đang đăng nhập
        const response = await api.get('/api/taikhoan/me/'); 
        setFormData({
            ...response.data,
            password: '', // Luôn để trống ô mật khẩu
        });
      } catch (err) {
        setError('Không thể tải thông tin cá nhân.');
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchUserData();
    }
  }, [show]); // Effect này chỉ chạy khi 'show' thay đổi

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Loại bỏ các trường không cần gửi đi
    const { username, MaVaiTro, ...updateData } = formData;

    // Chỉ gửi mật khẩu nếu người dùng đã nhập
    if (!updateData.password || updateData.password.trim() === '') {
        delete updateData.password;
    }
    
    try {
      // Giả sử bạn có endpoint này để cập nhật thông tin
      await api.patch('/api/taikhoan/me/', updateData); 
      setSuccess('Cập nhật thông tin thành công!');
      setTimeout(() => {
        onHide(); // Tự động đóng modal sau khi thành công
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Có lỗi xảy ra khi cập nhật.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Thông tin cá nhân</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          {loading && !formData ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : formData && (
            <>
              {/* Loại bỏ ô Tên đăng nhập và Vai trò */}
              <Row>
                <Col md={12}><Form.Group className="mb-3">
                    <Form.Label>Mật khẩu (để trống nếu không muốn đổi)</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} />
                </Form.Group></Col>
              </Row>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Họ *</Form.Label><Form.Control type="text" name="Ho" value={formData.Ho} onChange={handleInputChange} required /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Tên *</Form.Label><Form.Control type="text" name="Ten" value={formData.Ten} onChange={handleInputChange} required /></Form.Group></Col>
              </Row>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Giới tính *</Form.Label><Form.Select name="GioiTinh" value={formData.GioiTinh} onChange={handleInputChange} required>
                    <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option>
                </Form.Select></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Ngày sinh *</Form.Label><Form.Control type="date" name="NgaySinh" value={formData.NgaySinh} onChange={handleInputChange} required /></Form.Group></Col>
              </Row>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Số điện thoại *</Form.Label><Form.Control type="tel" name="SoDienThoai" value={formData.SoDienThoai} onChange={handleInputChange} required /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Email *</Form.Label><Form.Control type="email" name="Email" value={formData.Email} onChange={handleInputChange} required /></Form.Group></Col>
              </Row>
              <Form.Group className="mb-3"><Form.Label>Địa chỉ *</Form.Label><Form.Control type="text" name="DiaChi" value={formData.DiaChi} onChange={handleInputChange} required /></Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>Hủy</Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Cập nhật'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProfileModal;