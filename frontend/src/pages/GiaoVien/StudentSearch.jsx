import React from 'react';
import { Card } from 'antd';
import { GiaoVienView } from '../../../components/Student/views/GiaoVienView';
import MainLayout from '../../layouts/MainLayout';

const StudentSearchPage = () => {
  return (
    <MainLayout role="giao_vien">
      <Card title="TRA CỨU HỌC SINH" bordered={false}>
        <GiaoVienView />
      </Card>
    </MainLayout>
  );
};

export default StudentSearchPage;