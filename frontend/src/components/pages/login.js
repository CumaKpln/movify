import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      alert("Giriş başarılı!");
      navigate("/"); // başarılı giriş sonrası yönlendirme
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Giriş başarısız! Bilgilerinizi kontrol edin."
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-2 fw-bold">Giriş Yap</h3>
        <p
          className="text-center text-muted mb-4"
          style={{ fontSize: "0.9rem" }}
        >
          Hesabınıza erişmek için bilgilerinizi giriniz
        </p>

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
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

          <div className="text-end mb-3">
            <Link
              to="/reset-password"
              className="text-decoration-none small fw-semibold"
            >
              Şifremi Unuttum?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary w-100 btn-lg">
            Giriş Yap
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Hesabın yok mu?{" "}
          <Link to="/register" className="fw-semibold text-decoration-none">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
