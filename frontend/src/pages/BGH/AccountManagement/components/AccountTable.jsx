// src/pages/BGH/AccountManagement/components/AccountTable.jsx

import React from 'react';
import { Table, Spinner } from 'react-bootstrap';
import AccountTableRow from './AccountTableRow';

const AccountTable = ({ accounts, loading, searchTerm, roles, onEdit, onDelete }) => {
    if (loading) {
        return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
    }

    return (
        <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Họ tên</th>
                        <th>Vai trò</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th className="text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.length > 0 ? (
                        accounts.map((account, index) => (
                            <AccountTableRow 
                                key={account.id} 
                                account={account} 
                                index={index} 
                                roles={roles} 
                                onEdit={onEdit} 
                                onDelete={onDelete} 
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-muted p-4">
                                {searchTerm ? 'Không tìm thấy tài khoản nào.' : 'Chưa có tài khoản nào trong hệ thống.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default AccountTable;