import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Cards = () => {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/movies");
        setMovies(res.data);
      } catch (error) {
        console.error("Filmler alınamadı:", error);
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Kategoriler alınamadı:", error);
      }
    };
    fetchMovies();
    fetchCategories();
  }, []);

  useEffect(() => {
    const cookieToken = Cookies.get("SESSION_TOKEN");
    if (cookieToken) setToken(cookieToken);
  }, []);

  const getCategoryName = (id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Kategori yok";
  };

  const filteredMovies = selectedCategory
    ? movies.filter((movie) => movie.categoryId === selectedCategory)
    : movies;

  return (
    <div className="container mt-4">
      {/* Kategori filtre butonları */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          className={`btn btn-sm rounded-pill px-4 py-2 ${
            selectedCategory === null
              ? "btn-primary text-white shadow-sm"
              : "btn-outline-secondary text-secondary"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          Tüm Kategoriler
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`btn btn-sm rounded-pill px-4 py-2 ${
              selectedCategory === cat.id
                ? "btn-primary text-white shadow-sm"
                : "btn-outline-secondary text-secondary"
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Film kartları */}
      <div className="row g-4">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie, index) => (
            <div className="col-md-4 col-sm-6" key={index}>
              <div
                className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden position-relative"
                onMouseEnter={(e) => {
                  const overlay = e.currentTarget.querySelector(".overlay");
                  overlay.style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  const overlay = e.currentTarget.querySelector(".overlay");
                  overlay.style.opacity = 0;
                }}
              >
                <Link
                  to={`/card-detail/${movie.id}`}
                  className="text-decoration-none text-dark"
                >
                  {/* Film resmi */}
                  <img
                    src={movie.image}
                    alt={movie.name}
                    className="card-img-top img-fluid"
                    style={{ height: "250px", objectFit: "cover" }}
                  />

                  {/* Hover overlay */}
                  <div
                    className="overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white fw-bold"
                    style={{
                      background: "rgba(0,0,0,0.6)",
                      opacity: 0,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  >
                    <h5 className="mb-2">{movie.name}</h5>
                    <span className="badge bg-primary">
                      {getCategoryName(movie.categoryId)}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>Filmler yükleniyor veya seçilen kategoriye ait film yok...</p>
        )}
      </div>
    </div>
  );
};

export default Cards;
