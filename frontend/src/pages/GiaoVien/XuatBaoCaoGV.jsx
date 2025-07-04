import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
} from "react-bootstrap";
import api from "../../api";
import { useLayout } from "../../contexts/LayoutContext";

const XuatBaoCaoGV = () => {
  const { setPageTitle } = useLayout();

  const [nienKhoaOptions, setNienKhoaOptions] = useState([]);
  const [lopOptions, setLopOptions] = useState([]);
  const [monOptions, setMonOptions] = useState([]);
  const [hocKyOptions, setHocKyOptions] = useState([]);

  const [selectedNienKhoa, setSelectedNienKhoa] = useState("");
  const [selectedLop, setSelectedLop] = useState("");
  const [selectedMon, setSelectedMon] = useState("");
  const [selectedHocKy, setSelectedHocKy] = useState("");

  const [thongBao, setThongBao] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageTitle("Xuất báo cáo điểm học kỳ");
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (selectedNienKhoa) {
      fetchLopTheoNienKhoa(selectedNienKhoa);
    } else {
      setLopOptions([]);
      setSelectedLop("");
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
      console.error("Lỗi tải danh sách:", error);
      setThongBao("❌ Lỗi khi tải dữ liệu danh sách.");
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

  const handleXuatBaoCao = async () => {
    if (!selectedLop || !selectedMon || !selectedHocKy) {
      alert("Vui lòng chọn đầy đủ lớp, môn học và học kỳ.");
      return;
    }

    setLoading(true);
    setThongBao("");

    try {
      const res = await api.post(
        "/api/grading/baocao/",
        {
          IDLopHoc: selectedLop,
          IDMonHoc: selectedMon,
          IDHocKy: selectedHocKy,
        },
        {
          responseType: "blob", // Nhận file nhị phân
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "BaoCaoDiem.xlsx"); // Tên file tải về
      document.body.appendChild(link);
      link.click();
      link.remove();

      setThongBao("✅ Báo cáo đã được tải về thành công.");
    } catch (error) {
      console.error("Lỗi xuất báo cáo:", error);
      setThongBao("❌ Lỗi khi xuất báo cáo. Vui lòng kiểm tra dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm border-0">
        <h3 className="mb-4 text-center text-primary">📊 Xuất báo cáo điểm học kỳ</h3>

        <Row className="mb-3">
          <Col md={3}>
            <Form.Label>Niên khóa</Form.Label>
            <Form.Select
              value={selectedNienKhoa}
              onChange={(e) => setSelectedNienKhoa(e.target.value)}
            >
              <option value="">-- Chọn niên khóa --</option>
              {nienKhoaOptions.map((nk) => (
                <option key={nk.id} value={nk.id}>
                  {nk.TenNienKhoa}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label>Lớp học</Form.Label>
            <Form.Select
              value={selectedLop}
              onChange={(e) => setSelectedLop(e.target.value)}
              disabled={!selectedNienKhoa}
            >
              <option value="">-- Chọn lớp --</option>
              {lopOptions.map((lop) => (
                <option key={lop.id} value={lop.id}>
                  {lop.TenLop}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label>Môn học</Form.Label>
            <Form.Select
              value={selectedMon}
              onChange={(e) => setSelectedMon(e.target.value)}
            >
              <option value="">-- Chọn môn học --</option>
              {monOptions.map((mon) => (
                <option key={mon.id} value={mon.id}>
                  {mon.TenMonHoc}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label>Học kỳ</Form.Label>
            <Form.Select
              value={selectedHocKy}
              onChange={(e) => setSelectedHocKy(e.target.value)}
            >
              <option value="">-- Chọn học kỳ --</option>
              {hocKyOptions.map((hk) => (
                <option key={hk.id} value={hk.id}>
                  {hk.TenHocKy}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <div className="text-center mb-3">
          <Button onClick={handleXuatBaoCao} disabled={loading}>
            📥 Xuất báo cáo
          </Button>
        </div>

        {loading && (
          <div className="text-center mb-2">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {thongBao && <Alert variant="info">{thongBao}</Alert>}
      </Card>
    </Container>
  );
};

export default XuatBaoCaoGV;
