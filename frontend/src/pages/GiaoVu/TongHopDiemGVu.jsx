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
import api from "../../api";
import { useLayout } from "../../contexts/LayoutContext";
import { FaChartBar } from "react-icons/fa";
import "../../assets/styles/GiaoVienDashboard.css";

const TongHopDiemGVu = () => {
  const { setPageTitle } = useLayout();

  const [nienKhoaOptions, setNienKhoaOptions] = useState([]);
  const [lopOptions, setLopOptions] = useState([]);
  const [hocKyOptions, setHocKyOptions] = useState([]);
  const [monOptions, setMonOptions] = useState([]);
  const [filterType, setFilterType] = useState("lop");

  const [selectedNienKhoa, setSelectedNienKhoa] = useState("");
  const [selectedLop, setSelectedLop] = useState("");
  const [selectedHocKy, setSelectedHocKy] = useState("");
  const [selectedMon, setSelectedMon] = useState("");

  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thongBao, setThongBao] = useState("");

  useEffect(() => {
    setPageTitle("Tổng hợp điểm học kỳ - Giáo vụ");
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (selectedNienKhoa) {
      fetchLopTheoNienKhoa(selectedNienKhoa);
    } else {
      setLopOptions([]);
    }
  }, [selectedNienKhoa]);

  const fetchDropdowns = async () => {
    try {
      const [nkRes, monRes, hkRes] = await Promise.all([
        api.get("/api/configurations/nienkhoa/"),
        api.get("/api/subjects/monhoc/"),
        api.get("/api/grading/hocky/"),
      ]);
      setNienKhoaOptions(nkRes.data);
      setMonOptions(monRes.data);
      setHocKyOptions(hkRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  const fetchLopTheoNienKhoa = async (idNienKhoa) => {
    try {
      const res = await api.get("/api/classes/lop/", {
        params: { IDNienKhoa: idNienKhoa },
      });
      setLopOptions(res.data);
    } catch (error) {
      console.error("Lỗi khi tải lớp:", error);
    }
  };

  const handleTongHop = async () => {
    if (!selectedNienKhoa || !selectedHocKy || !selectedMon) {
      alert("Vui lòng chọn đầy đủ niên khóa, môn học và học kỳ.");
      return;
    }

    if (filterType === "lop" && !selectedLop) {
      alert("Vui lòng chọn lớp.");
      return;
    }

    setLoading(true);
    setThongBao("");
    setDanhSach([]);

    try {
      const payload = {
        IDHocKy: selectedHocKy,
        IDMonHoc: selectedMon,
        IDNienKhoa: selectedNienKhoa,
      };

      if (filterType === "lop") {
        payload.IDLopHoc = selectedLop;
      } else if (filterType === "khoi") {
        payload.PhamVi = "khoi";
      } else if (filterType === "tatca") {
        payload.PhamVi = "tatca";
      }

      const res = await api.post("/api/grading/tonghop/", payload);
      setDanhSach(res.data);
      setThongBao("✅ Đã tổng hợp điểm thành công.");
    } catch (err) {
      console.error("Lỗi tổng hợp:", err);
      setThongBao("❌ Lỗi khi tổng hợp điểm. Vui lòng kiểm tra dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Container fluid className="px-4 py-4">
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
                    <FaChartBar size={32} className="text-white avatar-icon" />
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
              <p className="text-white-75 mb-0 banner-subtitle">Phân tích, thống kê và quản lý điểm toàn trường</p>
            </div>
          </div>
        </div>

        <Card className="p-4 shadow-sm border-0">
          <h4 className="mb-4 text-primary text-center fw-bold">Tổng hợp điểm học kỳ (Giáo vụ)</h4>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Label>Niên khóa</Form.Label>
              <Form.Select value={selectedNienKhoa} onChange={(e) => setSelectedNienKhoa(e.target.value)}>
                <option value="">-- Chọn niên khóa --</option>
                {nienKhoaOptions.map((nk) => (
                  <option key={nk.id} value={nk.id}>{nk.TenNienKhoa}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label>Môn học</Form.Label>
              <Form.Select value={selectedMon} onChange={(e) => setSelectedMon(e.target.value)}>
                <option value="">-- Chọn môn học --</option>
                {monOptions.map((mon) => (
                  <option key={mon.id} value={mon.id}>{mon.TenMonHoc}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label>Học kỳ</Form.Label>
              <Form.Select value={selectedHocKy} onChange={(e) => setSelectedHocKy(e.target.value)}>
                <option value="">-- Chọn học kỳ --</option>
                {hocKyOptions.map((hk) => (
                  <option key={hk.id} value={hk.id}>{hk.TenHocKy}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label>Phạm vi tổng hợp</Form.Label>
              <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="lop">Một lớp cụ thể</option>
                <option value="khoi">Toàn khối</option>
                <option value="tatca">Toàn trường</option>
              </Form.Select>
            </Col>
          </Row>

          {filterType === "lop" && (
            <Row className="mb-3">
              <Col md={3}>
                <Form.Label>Chọn lớp</Form.Label>
                <Form.Select value={selectedLop} onChange={(e) => setSelectedLop(e.target.value)}>
                  <option value="">-- Chọn lớp --</option>
                  {lopOptions.map((lop) => (
                    <option key={lop.id} value={lop.id}>{lop.TenLop}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          )}

          <div className="text-center mb-4">
            <Button onClick={handleTongHop} className="px-4 btn-primary">
              ⚙️ Tổng hợp điểm
            </Button>
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : danhSach.length > 0 ? (
            <Table striped bordered hover responsive className="align-middle">
              <thead className="table-success text-center">
                <tr>
                  <th>#</th>
                  <th>Họ tên</th>
                  <th>Lớp</th>
                  <th>Điểm TB học kỳ</th>
                  <th>Xếp loại</th>
                </tr>
              </thead>
              <tbody>
                {danhSach.map((hs, idx) => (
                  <tr key={hs.id}>
                    <td className="text-center">{idx + 1}</td>
                    <td>{hs.HoTen}</td>
                    <td className="text-center">{hs.TenLop ?? "-"}</td>
                    <td className="text-center">{hs.DiemTBHocKy?.toFixed(2) ?? "-"}</td>
                    <td className="text-center">{hs.XepLoai ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : null}

          {thongBao && <Alert variant="info">{thongBao}</Alert>}
        </Card>
      </Container>
    </div>
  );
};

export default TongHopDiemGVu;