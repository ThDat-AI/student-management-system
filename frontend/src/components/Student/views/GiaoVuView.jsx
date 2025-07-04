import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import StudentSearch from '../StudentSearch';
import StudentForm from '../StudentForm';
import axios from 'axios';

const GiaoVuView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/hoc-sinh/');
      setData(res.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSearch = (value) => {
    fetchStudents({ search: value });
  };

  const EditButton = ({ record }) => (
    <Button 
      icon={<EditOutlined />}
      onClick={() => {
        setSelectedStudent(record);
        setFormVisible(true);
      }}
    />
  );

  const DeleteButton = ({ record }) => (
    <Button 
      danger 
      icon={<DeleteOutlined />}
      onClick={async () => {
        try {
          await axios.delete(`/api/hoc-sinh/${record.id}/`);
          message.success('Xóa học sinh thành công');
          fetchStudents();
        } catch (error) {
          message.error('Xóa học sinh thất bại');
        }
      }}
    />
  );

  return (
    <div>
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={() => {
          setSelectedStudent(null);
          setFormVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Thêm học sinh
      </Button>

      <StudentSearch
        data={data}
        loading={loading}
        onSearch={handleSearch}
        actionButtons={[EditButton, DeleteButton]}
      />

      <Modal
        title={selectedStudent ? 'Sửa học sinh' : 'Thêm học sinh mới'}
        visible={formVisible}
        footer={null}
        onCancel={() => setFormVisible(false)}
        width={700}
        destroyOnClose
      >
        <StudentForm 
          initialValues={selectedStudent}
          onSuccess={() => {
            setFormVisible(false);
            fetchStudents();
          }}
        />
      </Modal>
    </div>
  );
};

export default GiaoVuView;