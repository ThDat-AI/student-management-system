import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const AccountModal = ({ show, onHide, modalType, selectedAccount, roles, onSubmit, error, success }) => {
  const initialFormState = {
    username: '', password: '', Ho: '', Ten: '', MaVaiTro: '',
    GioiTinh: 'Nam', NgaySinh: '', DiaChi: '', SoDienThoai: '', Email: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (show) {
      if (modalType === 'edit' && selectedAccount) {
        let maVaiTro = '';
        if (selectedAccount.MaVaiTro) {
            maVaiTro = typeof selectedAccount.MaVaiTro === 'string' 
              ? selectedAccount.MaVaiTro 
              : selectedAccount.MaVaiTro.MaVaiTro;
        }
        setFormData({
          username: selectedAccount.user?.username || '',
          password: '',
          Ho: selectedAccount.Ho, Ten: selectedAccount.Ten, MaVaiTro: maVaiTro,
          GioiTinh: selectedAccount.GioiTinh, NgaySinh: selectedAccount.NgaySinh,
          DiaChi: selectedAccount.DiaChi, SoDienThoai: selectedAccount.SoDienThoai,
          Email: selectedAccount.Email
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [show, modalType, selectedAccount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {modalType === 'create' ? 'Tạo tài khoản mới' : 'Chỉnh sửa tài khoản'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Row>
            <Col md={6}><Form.Group className="mb-3">
                <Form.Label>Tên đăng nhập *</Form.Label>
                <Form.Control type="text" name="username" value={formData.username} onChange={handleInputChange} required disabled={modalType === 'edit'}/>
            </Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3">
                <Form.Label>Mật khẩu {modalType === 'edit' ? '(để trống nếu không đổi)' : '*'}</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} required={modalType === 'create'}/>
            </Form.Group></Col>
          </Row>
          <Row>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Họ *</Form.Label><Form.Control type="text" name="Ho" value={formData.Ho} onChange={handleInputChange} required/></Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Tên *</Form.Label><Form.Control type="text" name="Ten" value={formData.Ten} onChange={handleInputChange} required/></Form.Group></Col>
          </Row>
          <Row>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Vai trò *</Form.Label><Form.Select name="MaVaiTro" value={formData.MaVaiTro} onChange={handleInputChange} required>
                <option value="">Chọn vai trò</option>
                {roles.map(role => (<option key={role.MaVaiTro} value={role.MaVaiTro}>{role.TenVaiTro}</option>))}
            </Form.Select></Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Giới tính *</Form.Label><Form.Select name="GioiTinh" value={formData.GioiTinh} onChange={handleInputChange} required>
                <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option>
            </Form.Select></Form.Group></Col>
          </Row>
          <Row>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Ngày sinh *</Form.Label><Form.Control type="date" name="NgaySinh" value={formData.NgaySinh} onChange={handleInputChange} required/></Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Số điện thoại *</Form.Label><Form.Control type="tel" name="SoDienThoai" value={formData.SoDienThoai} onChange={handleInputChange} pattern="^\d{10,11}$" title="Số điện thoại phải có 10-11 chữ số" required/></Form.Group></Col>
          </Row>
          <Row>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Email *</Form.Label><Form.Control type="email" name="Email" value={formData.Email} onChange={handleInputChange} required/></Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Địa chỉ *</Form.Label><Form.Control type="text" name="DiaChi" value={formData.DiaChi} onChange={handleInputChange} required/></Form.Group></Col>
          </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Hủy</Button>
          <Button variant="primary" type="submit">
            {modalType === 'create' ? 'Tạo tài khoản' : 'Cập nhật'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AccountModal;