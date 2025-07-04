import React from 'react';
import { Table, Input, Button, Space, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const StudentSearch = ({ 
  data = [], 
  loading = false,
  onSearch,
  showActions = true,
  actionButtons = []
}) => {
  const columns = [
    {
      title: 'Mã HS',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: 'Họ tên',
      render: (_, record) => `${record.Ho} ${record.Ten}`,
    },
    {
      title: 'Lớp',
      dataIndex: ['LopHoc', 'TenLop'],
    },
    ...(showActions ? [{
      title: 'Thao tác',
      render: (_, record) => (
        <Space size="middle">
          {actionButtons.map((ButtonComponent, index) => (
            <ButtonComponent key={index} record={record} />
          ))}
        </Space>
      ),
    }] : [])
  ];

  return (
    <div className="student-search">
      <Input.Search
        placeholder="Tìm theo tên hoặc mã HS"
        allowClear
        enterButton={<Button icon={<SearchOutlined />}>Tìm kiếm</Button>}
        onSearch={onSearch}
        style={{ width: 400, marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default React.memo(StudentSearch);