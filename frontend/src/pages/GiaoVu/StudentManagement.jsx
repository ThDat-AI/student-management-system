import React from 'react';
import { Card } from 'antd';
import { GiaoVuView } from '../../../components/Student/views/GiaoVuView'; // Import component
import MainLayout from '../../layouts/MainLayout'; // Layout chung

const StudentManagementPage = () => {
  return (
    <MainLayout role="giao_vu"> {/* Bọc layout và check quyền */}
      <Card title="QUẢN LÝ HỌC SINH" bordered={false}>
        <GiaoVuView /> {/* Sử dụng component đã tạo */}
      </Card>
    </MainLayout>
  );
};

export default StudentManagementPage;