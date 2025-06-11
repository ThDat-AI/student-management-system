import React, { useState, useEffect } from 'react';
import { useLayout } from '../../contexts/LayoutContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Form, Badge } from 'react-bootstrap';
import { FaPlus, FaSearch } from 'react-icons/fa';
import api from '../../api';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ROLE } from '../../constants';

import SharedNavbar from '../../components/SharedNavbar';
import AccountTable from './components/AccountManagement/AccountTable';
import AccountModal from './components/AccountManagement/AccountModal';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [vaiTros, setVaiTros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { setPageTitle } = useLayout();
  
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Quản lý tài khoản"); 
    const role = localStorage.getItem(USER_ROLE);
    if (role !== 'BGH') {
      navigate('/unauthorized', { replace: true });
      return;
    }
    fetchAccounts();
    fetchVaiTros();
  }, [navigate, setPageTitle]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/taikhoan/');
      setAccounts(response.data);
    } catch (error) {
      setError('Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const fetchVaiTros = async () => {
    try {
      const response = await api.get('/api/vaitro/');
      setVaiTros(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setVaiTros([
        { MaVaiTro: 'BGH', TenVaiTro: 'Ban Giám Hiệu' },
        { MaVaiTro: 'GiaoVu', TenVaiTro: 'Giáo Vụ' },
        { MaVaiTro: 'GiaoVien', TenVaiTro: 'Giáo Viên' }
      ]);
    }
  };



  const handleShowModal = (type, account = null) => {
    setModalType(type);
    setSelectedAccount(account);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Reset state sau khi đóng modal để tránh lỗi
    setSelectedAccount(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (formData) => {
    setError('');
    setSuccess('');

    try {
      if (modalType === 'create') {
        const createData = {
          user: { username: formData.username, password: formData.password },
          Ho: formData.Ho, Ten: formData.Ten, MaVaiTro: formData.MaVaiTro,
          GioiTinh: formData.GioiTinh, NgaySinh: formData.NgaySinh,
          DiaChi: formData.DiaChi, SoDienThoai: formData.SoDienThoai, Email: formData.Email
        };
        await api.post('/api/taikhoan/create/', createData);
        setSuccess('Tạo tài khoản thành công!');
      } else {
        const updateData = {
          Ho: formData.Ho, Ten: formData.Ten, MaVaiTro: formData.MaVaiTro,
          GioiTinh: formData.GioiTinh, NgaySinh: formData.NgaySinh,
          DiaChi: formData.DiaChi, SoDienThoai: formData.SoDienThoai, Email: formData.Email
        };
        if (formData.password && formData.password.trim() !== '') {
            updateData.user = { password: formData.password };
        }
        await api.patch(`/api/taikhoan/${selectedAccount.id}/update/`, updateData);
        setSuccess('Cập nhật tài khoản thành công!');
      }
      
      fetchAccounts();
      setTimeout(() => handleCloseModal(), 1500);

    } catch (error) {
        const errorData = error.response?.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          setError(errorMessages);
        } else {
          setError(errorData?.detail || 'Có lỗi xảy ra.');
        }
    }
  };

  const handleDelete = async (account) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản "${account.Ho} ${account.Ten}"?`)) {
      try {
        await api.delete(`/api/taikhoan/${account.id}/delete/`);
        setAccounts(accounts.filter(acc => acc.id !== account.id));
      } catch (error) {
        setError(error.response?.data?.detail || 'Không thể xóa tài khoản.');
      }
    }
  };

  const getRoleBadge = (roleCode, displayText) => {
    const roleColors = { 'BGH': 'danger', 'GiaoVu': 'warning', 'GiaoVien': 'success' };
    return <Badge bg={roleColors[roleCode] || 'secondary'}>{displayText || roleCode}</Badge>;
  };
  
  const getRoleNameByCode = (code) => {
    const role = vaiTros.find(v => v.MaVaiTro === code);
    return role ? role.TenVaiTro : code;
  };

  const filteredAccounts = accounts.filter(account =>
    `${account.Ho} ${account.Ten}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (account.Email && account.Email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (account.SoDienThoai && account.SoDienThoai.includes(searchTerm))
  );

  return (
    <>
      <Container>
        <Alerts error={error} success={success} setError={setError} setSuccess={setSuccess} />
        
        <Row className="mb-4 align-items-center">
          <Col md={6}><h3>Danh sách tài khoản</h3></Col>
          <Col md={6} className="text-end">
            <Button variant="primary" onClick={() => handleShowModal('create')}>
              <FaPlus className="me-2" /> Tạo tài khoản mới
            </Button>
          </Col>
        </Row>
        
        <Row className="mb-3">
          <Col md={6}>
            <div className="position-relative">
              <Form.Control type="text" placeholder="Tìm kiếm theo tên, email, SĐT..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
            </div>
          </Col>
        </Row>

        <AccountTable 
          accounts={filteredAccounts}
          loading={loading}
          searchTerm={searchTerm}
          onEdit={(account) => handleShowModal('edit', account)}
          onDelete={handleDelete}
          getRoleNameByCode={getRoleNameByCode}
          getRoleBadge={getRoleBadge}
        />
        
        {showModal && (
          <AccountModal 
            show={showModal}
            onHide={handleCloseModal}
            modalType={modalType}
            selectedAccount={selectedAccount}
            roles={vaiTros}
            onSubmit={handleSubmit}
            error={error}
            success={success}
          />
        )}
      </Container>
    </>
  );
};

// Component con để hiển thị Alert
const Alerts = ({ error, success, setError, setSuccess }) => (
    <>
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
    </>
);

export default AccountManagement;