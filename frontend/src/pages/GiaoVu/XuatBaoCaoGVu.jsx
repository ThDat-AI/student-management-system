import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useLayout } from "../../contexts/LayoutContext";
import api from "../../api";

const XuatBaoCaoGVu = () => {
  const { setPageTitle } = useLayout();
  const [lopList, setLopList] = useState([]);
  const [hocKy, setHocKy] = useState("1");
  const [format, setFormat] = useState("excel");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [selectedLop, setSelectedLop] = useState("");

  useEffect(() => {
    setPageTitle("Xuất báo cáo (Giáo vụ)");
    fetchLopList();
  }, []);

  const fetchLopList = async () => {
    try {
      const res = await api.get("/configurations/lop/");
      setLopList(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách lớp:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.post(
        "/grading/xuat-bao-cao-excel/",
        {
          lop: selectedLop,
          hoc_ky: hocKy,
          format,
        },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type:
          format === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bao-cao-giaovu-${selectedLop}.${format === "pdf" ? "pdf" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setMessage({ type: "success", text: "Xuất báo cáo thành công!" });
    } catch (error) {
      console.error("Lỗi xuất báo cáo:", error);
      setMessage({ type: "danger", text: "Xuất báo cáo thất bại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h4 className="fw-bold mb-3">Xuất báo cáo theo lớp</h4>

      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Lớp học</Form.Label>
              <Form.Select
                value={selectedLop}
                onChange={(e) => setSelectedLop(e.target.value)}
                required
              >
                <option value="">-- Chọn lớp --</option>
                {lopList.map((lop) => (
                  <option key={lop.id} value={lop.id}>
                    {lop.ten_lop || lop.TenLop}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Học kỳ</Form.Label>
              <Form.Select value={hocKy} onChange={(e) => setHocKy(e.target.value)}>
                <option value="1">Học kỳ 1</option>
                <option value="2">Học kỳ 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Định dạng</Form.Label>
              <Form.Select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Tạo báo cáo"}
        </Button>
      </Form>
    </Container>
  );
};

export default XuatBaoCaoGVu;
