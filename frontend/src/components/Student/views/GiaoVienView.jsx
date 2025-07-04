import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import StudentSearch from '../StudentSearch';
import axios from 'axios';

const GiaoVienView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/hoc-sinh/basic');
      setData(res.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách học sinh', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSearch = (value) => {
    fetchStudents({ search: value });
  };

  const DetailButton = ({ record }) => (
    <Button 
      type="link"
      onClick={() => {
        setSelectedStudent(record);
        setDetailVisible(true);
      }}
    >
      Xem chi tiết
    </Button>
  );

  return (
    <div>
      <StudentSearch
        data={data}
        loading={loading}
        onSearch={handleSearch}
        actionButtons={[DetailButton]}
      />

      <Modal
        title="Thông tin học sinh"
        visible={detailVisible}
        footer={null}
        onCancel={() => setDetailVisible(false)}
      >
        {selectedStudent && (
          <div className="student-detail">
            <p><strong>Mã HS:</strong> {selectedStudent.id}</p>
            <p><strong>Họ tên:</strong> {selectedStudent.Ho} {selectedStudent.Ten}</p>
            <p><strong>Lớp:</strong> {selectedStudent.LopHoc?.TenLop || 'Chưa phân lớp'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GiaoVienView;