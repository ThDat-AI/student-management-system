import React from 'react';
import { Card, Table, Spinner } from 'react-bootstrap';
import AccountTableRow from './AccountTableRow';

const AccountTable = ({ accounts, loading, searchTerm, onEdit, onDelete, getRoleNameByCode, getRoleBadge }) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <Card>
      <Card.Body>
        <Table responsive hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Vai trò</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  {searchTerm ? 'Không tìm thấy tài khoản nào' : 'Chưa có tài khoản nào'}
                </td>
              </tr>
            ) : (
              accounts.map((account, index) => (
                <AccountTableRow 
                  key={account.id}
                  account={account}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  getRoleNameByCode={getRoleNameByCode}
                  getRoleBadge={getRoleBadge}
                />
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default AccountTable;