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

const XuatBaoCaoBGH = () => {
  const { setPageTitle } = useLayout();
  const [hocKy, setHocKy] = useState("1");
  const [format, setFormat] = useState("excel");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setPageTitle("Xuất báo cáo toàn trường (BGH)");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.post(
        "/grading/xuat-bao-cao-excel/",
        {
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
      a.download = `bao-cao-bgh.${format === "pdf" ? "pdf" : "xlsx"}`;
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
      <h4 className="fw-bold mb-3">Xuất báo cáo toàn trường</h4>

      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Học kỳ</Form.Label>
              <Form.Select value={hocKy} onChange={(e) => setHocKy(e.target.value)}>
                <option value="1">Học kỳ 1</option>
                <option value="2">Học kỳ 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
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

export default XuatBaoCaoBGH;
