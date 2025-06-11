import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AccountTableRow = ({ account, index, onEdit, onDelete, getRoleNameByCode, getRoleBadge }) => {
  
  // Lấy ra mã vai trò một cách an toàn
  const roleCode = typeof account.MaVaiTro === 'object' && account.MaVaiTro !== null
                    ? account.MaVaiTro.MaVaiTro
                    : account.MaVaiTro;

  // Dùng mã vai trò để tìm tên đầy đủ
  const roleName = getRoleNameByCode(roleCode);

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <strong>{account.Ho} {account.Ten}</strong>
        <br />
        <small className="text-muted">@{account.user?.username}</small>
      </td>
      <td>{getRoleBadge(roleCode, roleName)}</td>
      <td>{account.Email}</td>
      <td>{account.SoDienThoai}</td>
      <td>{account.GioiTinh}</td>
      <td>{new Date(account.NgaySinh).toLocaleDateString('vi-VN')}</td>
      <td>
        <Button
          variant="outline-primary"
          size="sm"
          className="me-2"
          onClick={() => onEdit(account)}
        >
          <FaEdit />
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDelete(account)}
        >
          <FaTrash />
        </Button>
      </td>
    </tr>
  );
};

export default AccountTableRow;