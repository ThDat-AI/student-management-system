import React, { useEffect, useState } from "react";
import { Container, Form, Button, Table, Alert, Row, Col, Spinner } from "react-bootstrap";
import api from "../../api";
import { useLayout } from "../../contexts/LayoutContext";

const TongHopDiem = () => {
  const { setPageTitle } = useLayout();
  const [lopList, setLopList] = useState([]);
  const [hocKyList, setHocKyList] = useState([]);
  const [selectedLop, setSelectedLop] = useState("");
  const [selectedHocKy, setSelectedHocKy] = useState("");
  const [ketQua, setKetQua] = useState([]);
  const [loading, setLoading] = useState(false);
  const [canhBao, setCanhBao] = useState([]);

  useEffect(() => {
    setPageTitle("Tổng hợp điểm học kỳ");
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [lopRes, hkRes] = await Promise.all([
        api.get("/classes/lophoc/"),
        api.get("/grading/hocky/")
      ]);
      setLopList(lopRes.data);
      setHocKyList(hkRes.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách lớp hoặc học kỳ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLop || !selectedHocKy) return;

    setLoading(true);
    setKetQua([]);
    setCanhBao([]);

    try {
      const res = await api.post("/grading/tong-hop-diem/", {
        IDLopHoc: selectedLop,
        IDHocKy: selectedHocKy,
      });

      const data = res.data;
      const canhBaoList = data.filter(item => item.CanhBao);
      const ketQuaList = data.filter(item => !item.CanhBao);

      setCanhBao(canhBaoList);
      setKetQua(ketQuaList);
    } catch (err) {
      console.error("Lỗi tổng hợp điểm", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h4 className="mb-4">Tổng hợp điểm học kỳ</h4>

      <Form onSubmit={handleSubmit}>
        <Row className="align-items-end g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Chọn lớp học</Form.Label>
              <Form.Select value={selectedLop} onChange={(e) => setSelectedLop(e.target.value)} required>
                <option value="">-- Chọn lớp --</option>
                {lopList.map((lop) => (
                  <option key={lop.id} value={lop.id}>{lop.TenLop}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Chọn học kỳ</Form.Label>
              <Form.Select value={selectedHocKy} onChange={(e) => setSelectedHocKy(e.target.value)} required>
                <option value="">-- Chọn học kỳ --</option>
                {hocKyList.map((hk) => (
                  <option key={hk.id} value={hk.id}>{hk.TenHocKy}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Button type="submit" variant="primary" className="w-100">
              {loading ? <Spinner animation="border" size="sm" /> : "Tổng hợp"}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Cảnh báo thiếu điểm */}
      {canhBao.length > 0 && (
        <Alert variant="warning" className="mt-4">
          <strong>Cảnh báo:</strong>
          <ul className="mb-0">
            {canhBao.map((item, idx) => (
              <li key={idx}>{item.HocSinh}: {item.CanhBao}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Kết quả tổng hợp */}
      {ketQua.length > 0 && (
        <div className="mt-4">
          <h5>Kết quả tổng hợp</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Học sinh</th>
                <th>Điểm TB học kỳ</th>
                <th>Học lực</th>
              </tr>
            </thead>
            <tbody>
              {ketQua.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.HocSinh}</td>
                  <td>{item.DiemTBHocKy}</td>
                  <td>{item.HocLuc}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default TongHopDiem;
