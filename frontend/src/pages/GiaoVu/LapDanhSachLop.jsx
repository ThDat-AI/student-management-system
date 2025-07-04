// File: LapDanhSachLop.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload, FaUserPlus } from "react-icons/fa";

const API_BASE = "http://localhost:8000/api/lophoc/";

const LapDanhSachLop = () => {
  const [dsLop, setDsLop] = useState([]);
  const [selectedLop, setSelectedLop] = useState(null);
  const [dsHocSinh, setDsHocSinh] = useState([]);
  const [dsHocSinhChuaCoLop, setDsHocSinhChuaCoLop] = useState([]);
  const [selectedHocSinh, setSelectedHocSinh] = useState([]);

  useEffect(() => {
    fetchLopHoc();
  }, []);

  const fetchLopHoc = async () => {
    const res = await axios.get(API_BASE);
    setDsLop(res.data);
  };

  const fetchHocSinh = async (lopId) => {
    const [hsLopRes, hsChuaCoLopRes] = await Promise.all([
      axios.get(`${API_BASE}${lopId}/danh-sach-hoc-sinh/`),
      axios.get(`${API_BASE}${lopId}/hoc-sinh-chua-co-lop/`)
    ]);
    setDsHocSinh(hsLopRes.data);
    setDsHocSinhChuaCoLop(hsChuaCoLopRes.data);
  };

  const handleLopChange = (e) => {
    const lopId = e.target.value;
    setSelectedLop(lopId);
    fetchHocSinh(lopId);
  };

  const handleAddHocSinh = async () => {
    if (selectedHocSinh.length === 0) return alert("Vui lòng chọn học sinh");
    try {
      await axios.post(`${API_BASE}${selectedLop}/them-hoc-sinh/`, {
        hoc_sinh_ids: selectedHocSinh
      });
      setSelectedHocSinh([]);
      fetchHocSinh(selectedLop);
    } catch (err) {
      alert("Lỗi khi thêm học sinh vào lớp");
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get(`${API_BASE}${selectedLop}/xuat-danh-sach/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Lop_${selectedLop}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Xuất danh sách thất bại!");
    }
  };

  const handleCheckbox = (id) => {
    setSelectedHocSinh((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📋 Lập danh sách lớp</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <select className="form-select" onChange={handleLopChange} value={selectedLop || ""}>
            <option value="">-- Chọn lớp --</option>
            {dsLop.map((lop) => (
              <option key={lop.id} value={lop.id}>
                {lop.TenLop} ({lop.IDNienKhoa_display})
              </option>
            ))}
          </select>
        </div>
        {selectedLop && (
          <div className="col-md-6 text-end">
            <button className="btn btn-success me-2" onClick={handleAddHocSinh}>
              <FaUserPlus className="me-1" /> Thêm học sinh
            </button>
            <button className="btn btn-outline-primary" onClick={handleExport}>
              <FaDownload className="me-1" /> Xuất Excel
            </button>
          </div>
        )}
      </div>

      {selectedLop && (
        <div className="row">
          <div className="col-md-6">
            <h5>📥 Học sinh chưa có lớp</h5>
            <ul className="list-group">
              {dsHocSinhChuaCoLop.map((hs) => (
                <li key={hs.id} className="list-group-item">
                  <label>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={selectedHocSinh.includes(hs.id)}
                      onChange={() => handleCheckbox(hs.id)}
                    />
                    {hs.ho_ten} ({hs.ma_hoc_sinh})
                  </label>
                </li>
              ))}
              {dsHocSinhChuaCoLop.length === 0 && (
                <li className="list-group-item text-muted">Không có học sinh mới</li>
              )}
            </ul>
          </div>

          <div className="col-md-6">
            <h5>👨‍🎓 Danh sách học sinh lớp</h5>
            <ul className="list-group">
              {dsHocSinh.map((hs) => (
                <li key={hs.id} className="list-group-item">
                  {hs.ho_ten} ({hs.ma_hoc_sinh})
                </li>
              ))}
              {dsHocSinh.length === 0 && (
                <li className="list-group-item text-muted">Chưa có học sinh nào trong lớp</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LapDanhSachLop;
