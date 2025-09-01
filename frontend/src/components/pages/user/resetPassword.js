import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams(); // token URL’den
  const [email, setEmail] = useState(""); // kullanıcı maili
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password`, {
        email,
        token,
        password,
      });
      toast.success("Mailinize şifre sıfırlama bağlantısı gönderildi ");
      setTimeout(() => 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Bir hata oluştu ❌");
    }
  };
  // MAİL GÖNDERME SAYFASI
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Toaster position="top-center" />
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-3 fw-bold">Yeni Şifre</h3>
        <p
          className="text-center text-muted mb-4"
          style={{ fontSize: "0.9rem" }}
        >
          E-posta adresinizi giriniz.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary w-100">
            Mail Gönder
          </button>
        </form>
      </div>
    </div>
  );
}
