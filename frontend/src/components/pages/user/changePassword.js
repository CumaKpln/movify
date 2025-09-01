import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams(); // /reset-password/:token
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ŞİFRE DEĞİŞTİRME SAYFASI
  const handleReset = async (e) => {
    e.preventDefault();

    console.log(token, "frontend");

    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor ❌");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`, // istersen sadece /reset-password de kullanabilirsin
        {
           token, // ✅ backend bekliyor
          password, // ✅ backend bekliyor
        }
      );

      toast.success(res.data.message);
      navigate("/login"); // iş bittikten sonra login sayfasına yönlendir
    } catch (err) {
      toast.error(err.response?.data?.message || "Bir hata oluştu ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{ width: "400px" }}
      >
        <div className="card-body p-4">
          <h3 className="text-center mb-4 text-primary">🔐 Şifre Sıfırla</h3>
          <form onSubmit={handleReset}>
            <div className="mb-3">
              <label className="form-label">Yeni Şifre</label>
              <input
                type="password"
                className="form-control"
                placeholder="Yeni şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Şifre Tekrar</label>
              <input
                type="password"
                className="form-control"
                placeholder="Şifrenizi tekrar girin"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Güncelleniyor...
                </span>
              ) : (
                "Şifreyi Güncelle"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
