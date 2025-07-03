import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaFileExcel, FaPlus } from "react-icons/fa";

const API_BASE = "http://localhost:8000/api/lophoc/";

const LopHocManagement = () => {
  const [dsLop, setDsLop] = useState([]);
  const [dsKhoi, setDsKhoi] = useState([]);
  const [dsNienKhoa, setDsNienKhoa] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    TenLop: "",
    SiSo: "",
    IDKhoi: "",
    IDNienKhoa: "",
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      await axios.post(API_BASE, form);
      setForm({ TenLop: "", SiSo: "", IDKhoi: "", IDNienKhoa: "" });
      setFormError("");
      fetchLopHoc();
      setShowModal(false);
    } catch (err) {
      const errorMessage =
        err.response?.data && Object.values(err.response.data)[0][0];
      setFormError(errorMessage || "Lỗi không xác định.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá lớp này?")) {
      await axios.delete(`${API_BASE}delete/${id}/`);
      fetchLopHoc();
    }
  };

  const handleExport = async (id, tenLop) => {
    try {
      const res = await axios.get(`${API_BASE}${id}/xuat-danh-sach/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Lop_${tenLop}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Xuất danh sách thất bại!");
    }
  };

  const filtered = dsLop.filter((lop) =>
    lop.TenLop.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🎓 Quản lý lớp học</h2>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="🔍 Tìm theo tên lớp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" />
            Thêm lớp học
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
                <button
                  className="btn btn-outline-success btn-sm me-2"
                  onClick={() => handleExport(lop.id, lop.TenLop)}
                >
                  <FaFileExcel className="me-1" />
                  Xuất DS
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(lop.id)}
                >
                  <FaTrashAlt className="me-1" />
                  Xoá
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                Không tìm thấy lớp học phù hợp.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Thêm Lớp Học */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">➕ Thêm lớp học</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setFormError("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {formError && (
                  <div className="alert alert-danger">⚠️ {formError}</div>
                )}
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="TenLop"
                    placeholder="Tên lớp"
                    value={form.TenLop}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="SiSo"
                    type="number"
                    placeholder="Sĩ số"
                    value={form.SiSo}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <select
                    className="form-select"
                    name="IDKhoi"
                    value={form.IDKhoi}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn khối --</option>
                    {dsKhoi.map((khoi) => (
                      <option key={khoi.id} value={khoi.id}>
                        {khoi.TenKhoi}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <select
                    className="form-select"
                    name="IDNienKhoa"
                    value={form.IDNienKhoa}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn niên khóa --</option>
                    {dsNienKhoa.map((nk) => (
                      <option key={nk.id} value={nk.id}>
                        {nk.TenNienKhoa}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setFormError("");
                  }}
                >
                  Đóng
                </button>
                <button className="btn btn-success" onClick={handleAdd}>
                  Thêm lớp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LopHocManagement;
