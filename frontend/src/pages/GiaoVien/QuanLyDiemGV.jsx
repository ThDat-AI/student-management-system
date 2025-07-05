import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";
import { FaClipboardList } from "react-icons/fa";
import api from "../../api";
import "../../assets/styles/GiaoVienDashboard.css"; // reuse banner CSS

const QuanLyDiemGV = () => {
  const [lopList, setLopList] = useState([]);
  const [monHocList, setMonHocList] = useState([]);
  const [hocKyList, setHocKyList] = useState([]);
  const [nienKhoaList, setNienKhoaList] = useState([]);

  const [hocSinhList, setHocSinhList] = useState([]);
  const [diemData, setDiemData] = useState({});

  const [selectedNienKhoa, setSelectedNienKhoa] = useState("");
  const [selectedLop, setSelectedLop] = useState("");
  const [selectedMonHoc, setSelectedMonHoc] = useState("");
  const [selectedHocKy, setSelectedHocKy] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const daChonDayDu = selectedNienKhoa && selectedLop && selectedMonHoc && selectedHocKy;

  useEffect(() => {
    api.get("/api/configurations/nienkhoa/").then((res) => setNienKhoaList(res.data));
    api.get("/api/classes/lop/").then((res) => setLopList(res.data));
    api.get("/api/subjects/monhoc/").then((res) => setMonHocList(res.data));
    api.get("/api/grading/hocky/").then((res) => setHocKyList(res.data));
  }, []);

  const handleXuatDanhSach = async () => {
    if (!daChonDayDu) return;

    setMessage(null);
    setHocSinhList([]);
    setDiemData({});
    setLoading(true);

    try {
      const hsRes = await api.get(`/api/students/danhsach/?IDLopHoc=${selectedLop}`);
      const danhSachHS = hsRes.data;
      setHocSinhList(danhSachHS);

      const diemRes = await api.get(`/api/grading/diem/?IDLopHoc=${selectedLop}&IDMonHoc=${selectedMonHoc}&IDHocKy=${selectedHocKy}`);
      const diemMap = {};
      diemRes.data.forEach((hs) => {
        diemMap[hs.id] = {
          Diem15: hs.Diem15 === null ? "" : hs.Diem15,
          Diem1Tiet: hs.Diem1Tiet === null ? "" : hs.Diem1Tiet,
        };
      });
      setDiemData(diemMap);

      if (danhSachHS.length === 0) {
        setMessage({ variant: "info", text: "Không có học sinh trong lớp đã chọn." });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
      setMessage({ variant: "danger", text: "Không thể tải danh sách học sinh hoặc điểm." });
    } finally {
      setLoading(false);
    }
  };

  const handleDiemChange = (id, field, value) => {
    setDiemData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleLuuDiem = async () => {
    setLoading(true);
    setMessage(null);

    try {
      for (const hs of hocSinhList) {
        const diem = diemData[hs.id] || {};
        const diem15 = diem.Diem15 === "" || diem.Diem15 == null ? 0 : parseFloat(diem.Diem15);
        const diem1tiet = diem.Diem1Tiet === "" || diem.Diem1Tiet == null ? 0 : parseFloat(diem.Diem1Tiet);

        const payload = {
          IDHocSinh: hs.id,
          IDLopHoc: selectedLop,
          IDMonHoc: selectedMonHoc,
          IDHocKy: selectedHocKy,
          Diem15: diem15,
          Diem1Tiet: diem1tiet,
        };

        try {
          await api.put("/api/grading/capnhat/", payload);
        } catch (err) {
          if (err.response?.status === 404) {
            await api.post("/api/grading/nhap/", payload);
          } else throw err;
        }
      }

      setMessage({ variant: "success", text: "Lưu điểm thành công!" });
      await handleXuatDanhSach();
    } catch (err) {
      console.error("Lỗi lưu điểm:", err);
      setMessage({
        variant: "danger",
        text: err.response?.data?.detail || "Lỗi khi lưu điểm.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="px-4 py-4">
      {/* Banner biển xanh */}
      <div className="welcome-banner p-4 rounded-4 position-relative overflow-hidden mb-4">
        <div className="banner-bg-animation">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div className="floating-orb orb-5"></div>
        </div>
        <div className="grid-pattern"></div>
        <div className="wave-animation">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
        <div className="particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
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
            <h2 className="text-white mb-1 fw-bold banner-title">Quản lý điểm</h2>
            <p className="text-white-75 mb-0 banner-subtitle">Nhập, cập nhật và xuất bảng điểm học sinh</p>
          </div>
        </div>
      </div>

      {/* Card nội dung */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card className="mb-4 border-0 bg-light">
            <Card.Body>
              <Row className="gy-2 gx-3">
                <Col md={3}>
                  <Form.Select value={selectedNienKhoa} onChange={(e) => setSelectedNienKhoa(e.target.value)}>
                    <option value="">-- Niên khóa --</option>
                    {nienKhoaList.map((nk) => (
                      <option key={nk.id} value={nk.id}>{nk.TenNienKhoa}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select value={selectedLop} onChange={(e) => setSelectedLop(e.target.value)}>
                    <option value="">-- Lớp học --</option>
                    {lopList.map((lop) => (
                      <option key={lop.id} value={lop.id}>{lop.TenLop}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select value={selectedMonHoc} onChange={(e) => setSelectedMonHoc(e.target.value)}>
                    <option value="">-- Môn học --</option>
                    {monHocList.map((mon) => (
                      <option key={mon.id} value={mon.id}>{mon.TenMonHoc}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select value={selectedHocKy} onChange={(e) => setSelectedHocKy(e.target.value)}>
                    <option value="">-- Học kỳ --</option>
                    {hocKyList.map((hk) => (
                      <option key={hk.id} value={hk.id}>{hk.TenHocKy}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={1}>
                  <Button variant="outline-primary" onClick={handleXuatDanhSach} disabled={!daChonDayDu || loading} className="w-100">
                    {loading ? <Spinner size="sm" animation="border" /> : "Xuất"}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {message && (
            <Alert variant={message.variant} dismissible onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          {hocSinhList.length > 0 && (
            <Card className="mt-3 shadow-sm rounded-4">
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Họ tên học sinh</th>
                      <th>Điểm 15 phút</th>
                      <th>Điểm 1 tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hocSinhList.map((hs, idx) => (
                      <tr key={hs.id}>
                        <td>{idx + 1}</td>
                        <td>{hs.HoTen}</td>
                        <td>
                          <Form.Control
                            type="number"
                            min={0}
                            max={10}
                            step="0.1"
                            value={diemData[hs.id]?.Diem15 ?? ""}
                            onChange={(e) => handleDiemChange(hs.id, "Diem15", e.target.value)}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            min={0}
                            max={10}
                            step="0.1"
                            value={diemData[hs.id]?.Diem1Tiet ?? ""}
                            onChange={(e) => handleDiemChange(hs.id, "Diem1Tiet", e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="text-end">
                  <Button variant="success" onClick={handleLuuDiem} disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Lưu điểm"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuanLyDiemGV;
