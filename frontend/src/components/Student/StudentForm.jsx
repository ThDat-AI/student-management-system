import React from 'react';
import { Form, Input, DatePicker, Select, Button, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const StudentForm = ({ initialValues, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        NgaySinh: initialValues.NgaySinh ? dayjs(initialValues.NgaySinh) : null
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const data = {
        ...values,
        NgaySinh: values.NgaySinh.format('YYYY-MM-DD')
      };

      if (initialValues) {
        await axios.put(`/api/hoc-sinh/${initialValues.id}/`, data);
        message.success('Cập nhật học sinh thành công');
      } else {
        await axios.post('/api/hoc-sinh/', data);
        message.success('Thêm học sinh thành công');
      }
      
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="Ho" label="Họ" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="Ten" label="Tên" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="NgaySinh" label="Ngày sinh" rules={[{ required: true }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StudentForm;