// src/pages/GiaoVien/QuanLyDiemGV.jsx

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Table, Alert, Spinner } from "react-bootstrap";
import api from "../../api";
import { useLayout } from "../../contexts/LayoutContext";

const QuanLyDiemGV = () => {
  const { setPageTitle } = useLayout();
  const [lopOptions, setLopOptions] = useState([]);
  const [monOptions, setMonOptions] = useState([]);
  const [hocKyOptions, setHocKyOptions] = useState([]);

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

  const fetchDropdowns = async () => {
    try {
      const [lopRes, monRes, hkRes] = await Promise.all([
        api.get("/api/classes/lop/"),
        api.get("/api/subjects/monhoc/"),
        api.get("/api/grading/hocky/")
      ]);
      setLopOptions(lopRes.data);
      setMonOptions(monRes.data);
      setHocKyOptions(hkRes.data);
    } catch (error) {
      console.error("Lỗi tải dropdown:", error);
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
      <h3 className="mb-4">Nhập và cập nhật điểm học sinh</h3>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Select value={selectedLop} onChange={(e) => setSelectedLop(e.target.value)}>
            <option value="">-- Chọn lớp --</option>
            {lopOptions.map((lop) => (
              <option key={lop.id} value={lop.id}>{lop.TenLop}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select value={selectedMon} onChange={(e) => setSelectedMon(e.target.value)}>
            <option value="">-- Chọn môn --</option>
            {monOptions.map((mon) => (
              <option key={mon.id} value={mon.id}>{mon.TenMonHoc}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select value={selectedHocKy} onChange={(e) => setSelectedHocKy(e.target.value)}>
            <option value="">-- Chọn học kỳ --</option>
            {hocKyOptions.map((hk) => (
              <option key={hk.id} value={hk.id}>{hk.TenHocKy}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Button onClick={fetchDanhSachHocSinh} className="mb-4">📋 Tải danh sách học sinh</Button>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
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
                <td>{idx + 1}</td>
                <td>{hs.HoTen}</td>
                <td>
                  <Form.Control
                    type="number"
                    value={hs.DiemMieng}
                    onChange={(e) => handleChange(idx, "DiemMieng", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={hs.Diem15Phut}
                    onChange={(e) => handleChange(idx, "Diem15Phut", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={hs.Diem1Tiet}
                    onChange={(e) => handleChange(idx, "Diem1Tiet", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={hs.DiemHocKy}
                    onChange={(e) => handleChange(idx, "DiemHocKy", e.target.value)}
                  />
                </td>
                <td>
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
    </Container>
  );
};

export default QuanLyDiemGV;
