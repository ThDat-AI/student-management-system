import React, { useEffect, useState } from "react";
import { Container, Form, Button, Table, Alert, Row, Col, Spinner } from "react-bootstrap";
import api from "../../api";
import { useLayout } from "../../contexts/LayoutContext";

const TongHopDiemGVu = () => {
  const { setPageTitle } = useLayout();
  const [lopList, setLopList] = useState([]);
  const [hocKyList, setHocKyList] = useState([]);
  const [filterType, setFilterType] = useState("all"); // all | khoi | lop
  const [selectedHocKy, setSelectedHocKy] = useState("");
  const [selectedKhoi, setSelectedKhoi] = useState("");
  const [selectedLop, setSelectedLop] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageTitle("Tổng hợp điểm học kỳ (Giáo vụ)");
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
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedHocKy) return;

    let filteredLops = [];
    if (filterType === "lop" && selectedLop) {
      filteredLops = [selectedLop];
    } else if (filterType === "khoi" && selectedKhoi) {
      filteredLops = lopList
        .filter((lop) => lop.TenLop.includes(selectedKhoi))
        .map((lop) => lop.id);
    } else if (filterType === "all") {
      filteredLops = lopList.map((lop) => lop.id);
    }

    setLoading(true);
    const allResults = [];

    for (let lopId of filteredLops) {
      try {
        const res = await api.post("/grading/tong-hop-diem/", {
          IDLopHoc: lopId,
          IDHocKy: selectedHocKy,
        });
        allResults.push(...res.data);
      } catch (err) {
        console.error(`Lỗi khi xử lý lớp ID=${lopId}`, err);
      }
    }

    setResult(allResults);
    setLoading(false);
  };

  return (
    <Container className="py-4">
      <h4 className="mb-4">Tổng hợp điểm học kỳ (Giáo vụ)</h4>

      <Form onSubmit={handleSubmit}>
        <Row className="g-3 align-items-end">
          <Col md={3}>
            <Form.Label>Chọn học kỳ</Form.Label>
            <Form.Select
              value={selectedHocKy}
              onChange={(e) => setSelectedHocKy(e.target.value)}
              required
            >
              <option value="">-- Học kỳ --</option>
              {hocKyList.map((hk) => (
                <option key={hk.id} value={hk.id}>{hk.TenHocKy}</option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label>Lọc theo</Form.Label>
            <Form.Select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setSelectedKhoi("");
                setSelectedLop("");
              }}
            >
              <option value="all">Toàn trường</option>
              <option value="khoi">Khối</option>
              <option value="lop">Lớp cụ thể</option>
            </Form.Select>
          </Col>

          {filterType === "khoi" && (
            <Col md={2}>
              <Form.Label>Chọn khối</Form.Label>
              <Form.Select
                value={selectedKhoi}
                onChange={(e) => setSelectedKhoi(e.target.value)}
              >
                <option value="">-- Khối --</option>
                <option value="10">Khối 10</option>
                <option value="11">Khối 11</option>
                <option value="12">Khối 12</option>
              </Form.Select>
            </Col>
          )}

          {filterType === "lop" && (
            <Col md={3}>
              <Form.Label>Chọn lớp</Form.Label>
              <Form.Select
                value={selectedLop}
                onChange={(e) => setSelectedLop(e.target.value)}
              >
                <option value="">-- Lớp --</option>
                {lopList.map((lop) => (
                  <option key={lop.id} value={lop.id}>{lop.TenLop}</option>
                ))}
              </Form.Select>
            </Col>
          )}

          <Col md={2}>
            <Button type="submit" variant="primary" className="w-100">
              {loading ? <Spinner animation="border" size="sm" /> : "Tổng hợp"}
            </Button>
          </Col>
        </Row>
      </Form>

      {result.length > 0 && (
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
              {result.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.HocSinh}</td>
                  <td>{item.DiemTBHocKy || "?"}</td>
                  <td>{item.HocLuc || item.CanhBao}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default TongHopDiemGVu;
