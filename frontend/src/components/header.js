import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ------------------- LOGIN DURUMUNU KONTROL ET -------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
    else setIsLoggedIn(false);
  }, []);

  // ------------------- LOGOUT -------------------
  const handleLogout = () => {
    if (window.confirm("Çıkmak istediğinize emin misiniz?")) {
      localStorage.removeItem("token"); // JWT token siliniyor
      localStorage.removeItem("userId"); // Kullanıcı ID siliniyor
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-3">
      <div className="container">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          onClick={() => (window.location.href = "/")}
        >
          MOVİFY
        </Link>

        <div className="d-flex align-items-center ms-auto gap-3">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="btn btn-outline-secondary d-flex align-items-center gap-1 px-3 py-2 rounded-pill"
              >
                <i className="bi bi-person"></i>
                Profilim
              </Link>

              <Link
                to="/favorites"
                className="btn btn-outline-danger d-flex align-items-center gap-1 px-3 py-2 rounded-pill"
              >
                <i className="bi bi-heart"></i>
                Favorilerim
              </Link>

              <Link
                to="/add-movie"
                className="btn btn-outline-danger d-flex align-items-center gap-1 px-3 py-2 rounded-pill"
              >
                <i className="bi bi-plus-circle"></i>
                Film Ekle
              </Link>

              <button
                className="btn btn-outline-warning d-flex align-items-center gap-1 px-3 py-2 rounded-pill"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i>
                Çıkış Yap
              </button>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link
                to="/login"
                className="btn btn-outline-secondary d-flex align-items-center gap-1 px-3 py-2 rounded-pill"
              >
                <i className="bi bi-box-arrow-in-right"></i>
                Giriş Yap
              </Link>

              <Link
                to="/register"
                className="btn btn-primary d-flex align-items-center gap-1 px-3 py-2 rounded-pill"
              >
                <i className="bi bi-person-plus"></i>
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
