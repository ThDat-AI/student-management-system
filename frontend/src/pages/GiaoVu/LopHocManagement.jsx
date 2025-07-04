import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaPlus, FaEdit, FaBookOpen, FaUserPlus, FaFileExcel } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api/lophoc/";

const LopHocManagement = () => {
  const [dsLop, setDsLop] = useState([]);
  const [dsKhoi, setDsKhoi] = useState([]);
  const [dsNienKhoa, setDsNienKhoa] = useState([]);
  const [search, setSearch] = useState("");
  const [filterKhoi, setFilterKhoi] = useState("");
  const [filterNienKhoa, setFilterNienKhoa] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ TenLop: "", SiSo: "", IDKhoi: "", IDNienKhoa: "" });
  const [editLop, setEditLop] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDropdowns();
    fetchLopHoc();
  }, []);

  const fetchDropdowns = async () => {
    const [khoiRes, nkRes] = await Promise.all([
      axios.get(`${API_BASE}dropdown/khoi/`),
      axios.get(`${API_BASE}dropdown/nienkhoa/`),
    ]);
    setDsKhoi(khoiRes.data);
    setDsNienKhoa(nkRes.data);
  };

  const fetchLopHoc = async () => {
    const res = await axios.get(API_BASE);
    setDsLop(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    try {
      await axios.post(API_BASE, form);
      setForm({ TenLop: "", SiSo: "", IDKhoi: "", IDNienKhoa: "" });
      setFormError("");
      fetchLopHoc();
      setShowModal(false);
    } catch (err) {
      const errorMessage = err.response?.data && Object.values(err.response.data)[0][0];
      setFormError(errorMessage || "Lỗi không xác định.");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE}update/${editLop.id}/`, form);
      setEditLop(null);
      setForm({ TenLop: "", SiSo: "", IDKhoi: "", IDNienKhoa: "" });
      fetchLopHoc();
    } catch (err) {
      alert("Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá lớp này?")) {
      await axios.delete(`${API_BASE}delete/${id}/`);
      fetchLopHoc();
    }
  };

  const filtered = dsLop.filter((lop) => {
    const matchTen = lop.TenLop.toLowerCase().includes(search.toLowerCase());
    const matchKhoi = !filterKhoi || lop.IDKhoi === parseInt(filterKhoi);
    const matchNienKhoa = !filterNienKhoa || lop.IDNienKhoa === parseInt(filterNienKhoa);
    return matchTen && matchKhoi && matchNienKhoa;
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🎓 Quản lý lớp học</h2>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-3">
          <input className="form-control" placeholder="🔍 Tìm theo tên lớp..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-md-2">
          <select className="form-select" value={filterKhoi} onChange={(e) => setFilterKhoi(e.target.value)}>
            <option value="">-- Chọn khối --</option>
            {dsKhoi.map((k) => (
              <option key={k.id} value={k.id}>{k.TenKhoi}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filterNienKhoa} onChange={(e) => setFilterNienKhoa(e.target.value)}>
            <option value="">-- Chọn niên khóa --</option>
            {dsNienKhoa.map((n) => (
              <option key={n.id} value={n.id}>{n.TenNienKhoa}</option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" /> Thêm lớp học
          </button>
        </div>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Tên lớp</th>
            <th>Khối</th>
            <th>Sĩ số</th>
            <th>Niên khóa</th>
            <th className="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((lop) => (
            <tr key={lop.id}>
              <td>{lop.TenLop}</td>
              <td>{lop.IDKhoi_display}</td>
              <td>{lop.SiSo}</td>
              <td>{lop.IDNienKhoa_display}</td>
              <td className="text-center">
                <button className="btn btn-outline-info btn-sm me-2" onClick={() => navigate(`/giaovu/lophoc/${lop.id}/monhoc`)}>
                  <FaBookOpen className="me-1" /> Môn học
                </button>
                <button className="btn btn-outline-success btn-sm me-2" onClick={() => navigate(`/giaovu/lophoc/${lop.id}/danhsach`)}>
                  <FaUserPlus className="me-1" /> Học sinh
                </button>
                <button className="btn btn-outline-primary btn-sm me-2" onClick={() => navigate(`/giaovu/lophoc/${lop.id}/xuat`)}>
                  <FaFileExcel className="me-1" /> Xuất DS
                </button>
                <button className="btn btn-outline-warning btn-sm me-2" onClick={() => {
                  setEditLop(lop);
                  setForm({
                    TenLop: lop.TenLop,
                    SiSo: lop.SiSo,
                    IDKhoi: lop.IDKhoi,
                    IDNienKhoa: lop.IDNienKhoa,
                  });
                }}>
                  <FaEdit className="me-1" /> Sửa
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(lop.id)}>
                  <FaTrashAlt className="me-1" /> Xoá
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">Không tìm thấy lớp học phù hợp.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal thêm và sửa giống như phần bạn đã làm, giữ nguyên không cần sửa */}

    </div>
  );
};

export default LopHocManagement;