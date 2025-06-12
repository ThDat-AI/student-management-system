// src/pages/BGH/AccountManagement/components/AccountTableRow.jsx

import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AccountTableRow = ({ account, index, roles, onEdit, onDelete }) => {
    const roleCode = account?.MaVaiTro?.MaVaiTro || account?.MaVaiTro;
    const roleInfo = roles?.find(r => r.MaVaiTro === roleCode);
    const roleName = roleInfo?.TenVaiTro || roleCode || 'N/A';

    const roleColors = { 'BGH': 'danger', 'GiaoVu': 'warning', 'GiaoVien': 'success' };
    const roleBadge = <Badge bg={roleColors[roleCode] || 'secondary'}>{roleName}</Badge>;

    return (
        <tr>
            <td>{index + 1}</td>
            <td>
                <strong>{account.Ho} {account.Ten}</strong>
                <br />
                <small className="text-muted">@{account.user?.username}</small>
            </td>
            <td>{roleBadge}</td>
            <td>{account.Email}</td>
            <td>{account.SoDienThoai}</td>
            <td className="text-center">
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onEdit(account)} title="Chỉnh sửa">
                    <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(account)} title="Xóa">
                    <FaTrash />
                </Button>
            </td>
        </tr>
    );
};

export default AccountTableRow;