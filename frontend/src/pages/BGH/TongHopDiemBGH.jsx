import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaClipboardList } from "react-icons/fa";
import api from "../../api";
import "../../assets/styles/BGHDashboard.css";

const TongHopDiemBGH = () => {
  const [nienKhoaList, setNienKhoaList] = useState([]);
  const [lopList, setLopList] = useState([]);
  const [hocKyList, setHocKyList] = useState([]);

  const [selectedNienKhoa, setSelectedNienKhoa] = useState("");
  const [selectedLop, setSelectedLop] = useState("");
  const [selectedHocKy, setSelectedHocKy] = useState("");

  const [loading, setLoading] = useState(false);
  const [tongHopData, setTongHopData] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get("/api/configurations/nienkhoa/").then((res) => setNienKhoaList(res.data));
    api.get("/api/classes/lop/").then((res) => setLopList(res.data));
    api.get("/api/grading/hocky/").then((res) => setHocKyList(res.data));
  }, []);

  const getTenLop = () => {
    return lopList.find((lop) => lop.id === parseInt(selectedLop))?.TenLop || "N/A";
  };

  const getTenHocKy = () => {
    return hocKyList.find((hk) => hk.id === parseInt(selectedHocKy))?.TenHocKy || "N/A";
  };

  const handleTongHop = async () => {
    if (!selectedNienKhoa || !selectedLop || !selectedHocKy) {
      setMessage({ variant: "warning", text: "Vui lòng chọn đầy đủ niên khóa, lớp và học kỳ." });
      return;
    }

    setLoading(true);
    setMessage(null);
    setTongHopData([]);

    try {
      const res = await api.post("/api/grading/tonghop/", {
        IDLopHoc: selectedLop,
        IDHocKy: selectedHocKy,
      });

      if (Array.isArray(res.data)) {
        setTongHopData(res.data);
        if (res.data.length === 0) {
          setMessage({ variant: "info", text: "Không có dữ liệu tổng hợp cho lựa chọn đã chọn." });
        }
      } else {
        setMessage({ variant: "danger", text: "Dữ liệu không hợp lệ." });
      }
    } catch (err) {
      console.error("Lỗi tổng hợp điểm:", err);
      setMessage({
        variant: "danger",
        text: err.response?.data?.detail || "Lỗi khi tổng hợp điểm.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleXuatExcel = async () => {
    if (!selectedNienKhoa || !selectedLop || !selectedHocKy) {
      setMessage({ variant: "warning", text: "Vui lòng chọn đầy đủ trước khi xuất." });
      return;
    }

    setMessage(null);
    try {
      const res = await api.post(
        "/api/grading/xuatbaocao/",
        {
          IDLopHoc: selectedLop,
          IDHocKy: selectedHocKy,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;

      const lop = getTenLop();
      const hk = getTenHocKy();
      const nk = nienKhoaList.find((n) => n.id === parseInt(selectedNienKhoa))?.TenNienKhoa || "NienKhoa";

      link.setAttribute("download", `BaoCao_${lop}_${hk}_${nk}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Lỗi xuất Excel:", err);
      setMessage({
        variant: "danger",
        text: err.response?.data?.detail || "Lỗi khi xuất báo cáo.",
      });
    }
  };

  return (
    <Container fluid className="px-4 py-4">
      {/* Banner */}
      <div className="welcome-banner p-4 rounded-4 position-relative overflow-hidden mb-4">
        <div className="banner-bg-animation">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`floating-orb orb-${i}`}></div>
          ))}
        </div>
        <div className="grid-pattern"></div>
        <div className="wave-animation">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`wave wave-${i}`}></div>
          ))}
        </div>
        <div className="particles">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`particle particle-${i}`}></div>
          ))}
        </div>
        <div className="shimmer-effect"></div>
        <div className="welcome-content d-flex align-items-center">
          <div className="banner-avatar-section me-4">
            <div className="avatar-container">
              <div className="avatar-main">
                <div className="avatar-placeholder">
                  <FaClipboardList size={32} className="text-white avatar-icon" />
                </div>
              </div>
              <div className="avatar-ring ring-1"></div>
              <div className="avatar-ring ring-2"></div>
              <div className="avatar-pulse pulse-1"></div>
              <div className="avatar-pulse pulse-2"></div>
              <div className="avatar-glow"></div>
            </div>
          </div>
          <div>
            <h2 className="text-white mb-1 fw-bold banner-title">Tổng hợp điểm học kỳ</h2>
            <p className="text-white-75 mb-0 banner-subtitle">
              Ban Giám Hiệu theo dõi chất lượng học tập của toàn trường
            </p>
          </div>
        </div>
      </div>

      {/* Nội dung */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card className="mb-3 bg-light border-0">
            <Card.Body>
              <Row className="gy-2 gx-3">
                <Col md={4}>
                  <Form.Select
                    value={selectedNienKhoa}
                    onChange={(e) => setSelectedNienKhoa(e.target.value)}
                  >
                    <option value="">-- Chọn niên khóa --</option>
                    {nienKhoaList.map((nk) => (
                      <option key={nk.id} value={nk.id}>{nk.TenNienKhoa}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={selectedLop}
                    onChange={(e) => setSelectedLop(e.target.value)}
                  >
                    <option value="">-- Chọn lớp --</option>
                    {lopList.map((lop) => (
                      <option key={lop.id} value={lop.id}>{lop.TenLop}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={selectedHocKy}
                    onChange={(e) => setSelectedHocKy(e.target.value)}
                  >
                    <option value="">-- Chọn học kỳ --</option>
                    {hocKyList.map((hk) => (
                      <option key={hk.id} value={hk.id}>{hk.TenHocKy}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>

              <div className="mt-3 d-flex justify-content-end gap-2">
                <Button variant="outline-primary" onClick={handleTongHop} disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : "Tổng hợp điểm"}
                </Button>
                <Button variant="success" onClick={handleXuatExcel} disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : "Xuất Excel"}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {message && (
            <Alert variant={message.variant} dismissible onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          {Array.isArray(tongHopData) && tongHopData.length > 0 && (
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Họ tên</th>
                      <th>Lớp</th>
                      <th>Học kỳ</th>
                      <th>Điểm TB</th>
                      <th>Xếp loại</th>
                      <th>Thiếu điểm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tongHopData.map((hs, idx) => (
                      <tr key={hs.id}>
                        <td>{idx + 1}</td>
                        <td>{hs.HoTen}</td>
                        <td>{getTenLop()}</td>
                        <td>{getTenHocKy()}</td>
                        <td>{hs.DiemTB}</td>
                        <td>{hs.XepLoai}</td>
                        <td style={{ color: hs.CanhBao ? "red" : "green" }}>
                          {hs.CanhBao ? "Có thiếu!" : "Không thiếu!"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TongHopDiemBGH;

