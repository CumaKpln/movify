import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) return;

    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/users/${id}`
        );
        setUser(data);
        setNewEmail(data.email || "");
      } catch {
        toast.error("Kullanıcı bilgileri alınamadı ❌");
      }
    };

    fetchUser();
  }, []);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    const id = localStorage.getItem("userId");

    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        {
          currentPassword,
          newEmail,
        }
      );
      toast.success(data.message || "E-posta başarıyla güncellendi ✅");
      setCurrentPassword("");
      setUser(data.user || { ...user, email: newEmail });
    } catch (err) {
      toast.error(err.response?.data?.error || "Güncelleme başarısız ❌");
    }
  };
  const handleDeleteUser = async () => {
    if (
      !window.confirm(
        "⚠️ Bu işlem geri alınamaz. Kullanıcıyı silmek istediğinize emin misiniz?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      toast.success("Kullanıcı başarıyla silindi 🚀");

      // localStorage temizleme
      localStorage.removeItem("userId");
      localStorage.removeItem("token");

      // State'i sıfırlıyoruz
      setUser(null);

      // SPA yönlendirme (sayfa reload yok)
      navigate("/");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || "Kullanıcı silinemedi ❌");
    }
  };

  if (!user) return null;

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg rounded-4 p-4">
            {/* Profil Bilgisi */}
            <div className="text-center mb-4">
              <i
                className="bi bi-person-circle text-primary"
                style={{ fontSize: "4rem" }}
              ></i>
              <h4 className="fw-bold mt-2">{user.name}</h4>
              <p className="text-muted mb-1">{user.email}</p>
              <span className="badge bg-primary px-3 py-2 mt-2">Profilim</span>
            </div>

            {/* E-posta Güncelleme */}
            <form onSubmit={handleEmailUpdate} className="mb-4">
              <h5 className="mb-3 fw-semibold">E-posta Güncelle</h5>

              <div className="mb-3">
                <label className="form-label">Mevcut Şifre</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mevcut şifrenizi girin"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Yeni E-posta</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Yeni e-posta"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill"
              >
                Güncelle
              </button>
            </form>

            {/* Kullanıcı Silme */}
            <div className="border-top pt-3">
              <h6 className="text-danger fw-semibold mb-2">Hesabı Sil</h6>
              <p className="text-muted small">
                Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinir.
              </p>
              <button
                className="btn btn-outline-danger w-100 rounded-pill"
                onClick={handleDeleteUser}
              >
                Kullanıcıyı Kalıcı Olarak Sil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
