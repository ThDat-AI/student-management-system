import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import api from "../../api";
import { useLayout } from "../../contexts/LayoutContext";

const QuanLyDiemGV = () => {
  const { setPageTitle } = useLayout();
  const [nienKhoaOptions, setNienKhoaOptions] = useState([]);
  const [lopOptions, setLopOptions] = useState([]);
  const [monOptions, setMonOptions] = useState([]);
  const [hocKyOptions, setHocKyOptions] = useState([]);

  const [selectedNienKhoa, setSelectedNienKhoa] = useState("");
  const [selectedLop, setSelectedLop] = useState("");
  const [selectedMon, setSelectedMon] = useState("");
  const [selectedHocKy, setSelectedHocKy] = useState("");

  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thongBao, setThongBao] = useState("");

  useEffect(() => {
    setPageTitle("Nhập & Cập nhật điểm");
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
        api.get("/api/grading/hocky/")
      ]);
      setNienKhoaOptions(nkRes.data);
      setMonOptions(monRes.data);
      setHocKyOptions(hkRes.data);
    } catch (error) {
      console.error("Lỗi tải dropdown:", error);
    }
  };

  const fetchLopTheoNienKhoa = async (idNienKhoa) => {
    try {
      const res = await api.get("/api/classes/lop/", {
        params: { IDNienKhoa: idNienKhoa }
      });
      setLopOptions(res.data);
    } catch (error) {
      console.error("Lỗi khi tải lớp theo niên khóa:", error);
    }
  };

  const fetchDanhSachHocSinh = async () => {
    if (!selectedLop || !selectedMon || !selectedHocKy) {
      alert("Vui lòng chọn đầy đủ lớp, môn và học kỳ.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/api/students/danhsach/", {
        params: { IDLopHoc: selectedLop },
      });

      const students = await Promise.all(
        res.data.map(async (hs) => {
          const diemRes = await api.get("/api/grading/diem/", {
            params: {
              IDHocSinh: hs.id,
              IDLopHoc: selectedLop,
              IDMonHoc: selectedMon,
              IDHocKy: selectedHocKy
            }
          });

          const diem = diemRes.data[0] || {};
          return {
            ...hs,
            diemId: diem.id || null,
            DiemMieng: diem.DiemMieng ?? "",
            Diem15Phut: diem.Diem15Phut ?? "",
            Diem1Tiet: diem.Diem1Tiet ?? "",
            DiemHocKy: diem.DiemHocKy ?? ""
          };
        })
      );

      setDanhSach(students);
    } catch (error) {
      console.error("Lỗi khi tải danh sách học sinh:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...danhSach];
    updated[index][field] = value;
    setDanhSach(updated);
  };

  const safeParseFloat = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  const handleLuu = async (hs) => {
    const payload = {
      IDHocSinh: hs.id,
      IDLopHoc: selectedLop,
      IDMonHoc: selectedMon,
      IDHocKy: selectedHocKy,
      DiemMieng: safeParseFloat(hs.DiemMieng),
      Diem15Phut: safeParseFloat(hs.Diem15Phut),
      Diem1Tiet: safeParseFloat(hs.Diem1Tiet),
      DiemHocKy: safeParseFloat(hs.DiemHocKy),
    };

    try {
      if (hs.diemId) {
        await api.put(`/api/grading/capnhat/${hs.diemId}/`, payload);
        setThongBao(`✅ Đã cập nhật điểm cho ${hs.HoTen}`);
      } else {
        await api.post("/api/grading/nhap/", payload);
        setThongBao(`✅ Đã lưu điểm cho ${hs.HoTen}`);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        setThongBao(`❌ ${hs.HoTen}: ${JSON.stringify(err.response.data)}`);
      } else {
        setThongBao(`❌ Lỗi khi lưu điểm cho ${hs.HoTen}`);
      }
    }
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm border-0">
        <h3 className="mb-4 text-primary text-center">Nhập và cập nhật điểm học sinh</h3>

        <Row className="mb-4">
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
            <Form.Label>Lớp</Form.Label>
            <Form.Select value={selectedLop} onChange={(e) => setSelectedLop(e.target.value)}>
              <option value="">-- Chọn lớp --</option>
              {lopOptions.map((lop) => (
                <option key={lop.id} value={lop.id}>{lop.TenLop}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Môn học</Form.Label>
            <Form.Select value={selectedMon} onChange={(e) => setSelectedMon(e.target.value)}>
              <option value="">-- Chọn môn --</option>
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
        </Row>

        <div className="text-center mb-4">
          <Button onClick={fetchDanhSachHocSinh} className="px-4">📋 Tải danh sách học sinh</Button>
        </div>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped bordered hover responsive className="align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>#</th>
                <th>Họ tên</th>
                <th>Miệng</th>
                <th>15 phút</th>
                <th>1 tiết</th>
                <th>Học kỳ</th>
                <th>Lưu</th>
              </tr>
            </thead>
            <tbody>
              {danhSach.map((hs, idx) => (
                <tr key={hs.id}>
                  <td className="text-center">{idx + 1}</td>
                  <td>{hs.HoTen}</td>
                  <td>
                    <Form.Control
                      type="number"
                      name={`diem_mieng_${hs.id}`}
                      id={`diem_mieng_${hs.id}`}
                      value={hs.DiemMieng}
                      onChange={(e) => handleChange(idx, "DiemMieng", e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      name={`diem_15phut_${hs.id}`}
                      id={`diem_15phut_${hs.id}`}
                      value={hs.Diem15Phut}
                      onChange={(e) => handleChange(idx, "Diem15Phut", e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      name={`diem_1tiet_${hs.id}`}
                      id={`diem_1tiet_${hs.id}`}
                      value={hs.Diem1Tiet}
                      onChange={(e) => handleChange(idx, "Diem1Tiet", e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      name={`diem_hocky_${hs.id}`}
                      id={`diem_hocky_${hs.id}`}
                      value={hs.DiemHocKy}
                      onChange={(e) => handleChange(idx, "DiemHocKy", e.target.value)}
                    />
                  </td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleLuu(hs)}
                      disabled={
                        hs.DiemMieng === "" ||
                        hs.Diem15Phut === "" ||
                        hs.Diem1Tiet === "" ||
                        hs.DiemHocKy === ""
                      }
                    >
                      💾 Lưu
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {thongBao && <Alert variant="info" className="mt-3">{thongBao}</Alert>}
      </Card>
    </Container>
  );
};

export default QuanLyDiemGV;