import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users", form);
      console.log("Backend response:", res.data);

      toast.success("Kullanıcı başarıyla oluşturuldu! 🎉", {
        duration: 3000,
        position: "top-center",
      });
      navigate("/login");
    } catch (err) {
      console.error(
        "Register error:",
        err.response ? err.response.data : err.message
      );

      toast.error("Kullanıcı oluşturulamadı! ❌", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      {/* react-hot-toast için Toaster */}
      <Toaster />

      <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-2 fw-bold">Kayıt Ol</h3>
        <p
          className="text-center text-muted mb-4"
          style={{ fontSize: "0.9rem" }}
        >
          Yeni bir hesap oluşturmak için bilgilerinizi giriniz
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Ad Soyad</label>
            <input
              type="text"
              name="name"
              className="form-control form-control-lg"
              placeholder="Adınızı giriniz"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">E-posta</label>
            <input
              type="email"
              name="email"
              className="form-control form-control-lg"
              placeholder="ornek@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              name="password"
              className="form-control form-control-lg"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Button */}
          <button type="submit" className="btn btn-success w-100 btn-lg">
            Kayıt Ol
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Zaten hesabın var mı?{" "}
          <Link to="/login" className="fw-semibold text-decoration-none">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
