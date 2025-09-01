import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Favorites = () => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleAddFavorite = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!token) {
      const goLogin = window.confirm(
        "Favorilere ekleyebilmek için giriş yapmalısınız. Giriş yapmak ister misiniz?"
      );
      if (goLogin) navigate("/login");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/favorites/${userId}`, {
        movieId: id,
      });
      setIsFavorited(true);
      toast.success("Film favorilere eklendi! 🎬❤️");
    } catch (error) {
      console.error("Favorilere eklenemedi:", error);

      if (error.response?.status === 400) {
        toast.error("Bu film zaten favorilerinizde! 🎬❤️");
      } else if (error.response?.status === 401) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Bir hata oluştu. Tekrar deneyin.");
      }
    }
  };

  return (
    <div className="d-flex flex-column align-items-center gap-2 mb-3">
      <button
        className={`btn rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center ${
          isFavorited ? "bg-danger text-white" : "bg-light text-danger"
        }`}
        style={{
          width: "50px",
          height: "50px",
          transition: "all 0.3s ease",
        }}
        title={isFavorited ? "Favorilerde" : "Favorilere ekle"}
        onClick={handleAddFavorite}
        disabled={isFavorited}
      >
        <i
          className={`bi bi-heart${isFavorited ? "-fill" : ""}`}
          style={{ fontSize: "1.4rem" }}
        ></i>
      </button>

      <span
        className="fw-medium"
        style={{
          fontSize: "0.95rem",
          color: isFavorited ? "#dc3545" : "#6c757d",
        }}
      >
        {isFavorited ? "Favorilerde" : "Favorilere ekle"}
      </span>
    </div>
  );
};

export default Favorites;
