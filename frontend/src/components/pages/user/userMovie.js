import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deletedMovieId, setDeletedMovieId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [actors, setActors] = useState({}); // movieId => [actorObj]
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    category: "",
    image: "",
    subject: "",
    year: "",
  });

  // Kullanıcının filmlerini çek
  useEffect(() => {
    if (!userId || !token) return;
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/movies/${userId}`,
          {
            headers: { Authorization: token },
          }
        );
        setMovies(res.data);
      } catch (err) {
        console.error(
          "Film yükleme hatası:",
          err.response?.data || err.message
        );
      }
    };
    fetchMovies();
  }, [userId, token]);

  // Kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Kategori alınamadı:", err);
      }
    };
    fetchCategories();
  }, []);

  // Oyuncuları çek (film id'sine göre)
  const fetchActorsForMovies = async () => {
    try {
      const allActors = {};
      for (let movie of movies) {
        const res = await axios.get(
          `http://localhost:5000/api/movies_actors/${movie.id}`,
          { headers: { Authorization: token } }
        );
        allActors[movie.id] = Array.isArray(res.data) ? res.data : [res.data];
      }
      setActors(allActors);
    } catch (error) {
      console.error("Oyuncular alınamadı:", error);
    }
  };

  useEffect(() => {
    if (movies.length > 0) fetchActorsForMovies();
  }, [movies]);

  // Input değişimi
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Film düzenleme başlat
  const handleEditClick = (movie) => {
    setEditingMovie(movie);
    setForm({
      name: movie.name || "",
      category: movie.category || "",
      image: movie.image || "",
      subject: movie.subject || "",
      year: movie.year || "",
    });
  };

  // Film güncelle
  const handleUpdate = async () => {
    if (!editingMovie) return;
    try {
      const updatedData = { ...form };
      const { data } = await axios.put(
        `http://localhost:5000/api/movies/${editingMovie.id}`,
        updatedData,
        { headers: { Authorization: token } }
      );
      setMovies(movies.map((m) => (m.id === editingMovie.id ? data : m)));
      toast.success("Film başarıyla güncellendi!");
      setEditingMovie(null);
      setForm({
        name: "",
        category: "",
        image: "",
        subject: "",
        year: "",
      });
      window.location.reload();
    } catch (err) {
      console.error("Güncelleme hatası:", err.response?.data || err.message);
      toast.error("Güncelleme başarısız!");
    }
  };

  // Film sil
  const handleDelete = async (movieId) => {
    try {
      await axios.delete(`http://localhost:5000/api/movies/${movieId}`, {
        headers: { Authorization: token },
      });
      setMovies(movies.filter((m) => m.id !== movieId));
      setDeletedMovieId(movieId);
      toast.success(`Film başarıyla silindi! (ID: ${movieId})`);
    } catch (err) {
      console.error("Silme hatası:", err.response?.data || err.message);
      toast.error("Film silinemedi!");
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "-";
  };

  return (
    <div className="row g-4">
      <h3 className="mb-4">🎬 Yüklediğim Filmler</h3>

      {movies.length === 0 ? (
        <div className="alert alert-info">Henüz film yüklemediniz.</div>
      ) : (
        movies.map((movie) => (
          <div className="col-md-4" key={movie.id}>
            <div className="card shadow-sm border-0 h-100 rounded-4 movie-card">
              {movie.image && (
                <img
                  src={movie.image}
                  alt={movie.name}
                  className="card-img-top rounded-top-4"
                  style={{ height: "220px", objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{movie.name}</h5>
                <p className="text-muted mb-2">{movie.year}</p>
                <p
                  className="card-text flex-grow-1"
                  style={{ fontSize: "0.9rem" }}
                >
                  {movie.subject}
                </p>
                <p className="text-muted mb-1">
                  <strong>Kategori:</strong> {getCategoryName(movie.categoryId)}
                </p>
                <p className="text-muted mb-1">
                  <strong>Oyuncular:</strong>{" "}
                  {actors[movie.id]?.length
                    ? actors[movie.id]
                        .map((a) => `${a.name} (${a.age})`)
                        .join(", ")
                    : "-"}
                </p>
                <div className="d-flex gap-2 mt-2">
                  <Link
                    to={`/card-detail/${movie.id}`}
                    className="btn btn-primary btn-sm w-33"
                  >
                    <i className="bi bi-eye me-2"></i> Detay
                  </Link>
                  <button
                    className="btn btn-warning btn-sm w-33"
                    onClick={() => handleEditClick(movie)}
                  >
                    <i className="bi bi-pencil-square me-2"></i> Düzenle
                  </button>
                  <button
                    className="btn btn-danger btn-sm w-33"
                    onClick={() => handleDelete(movie.id)}
                  >
                    <i className="bi bi-trash me-2"></i> Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {editingMovie && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">🎬 Film Düzenle</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingMovie(null)}
                ></button>
              </div>
              <div className="modal-body">
                {["name", "category", "image", "subject", "year"].map(
                  (field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">
                        {field === "name"
                          ? "Film Adı"
                          : field === "category"
                          ? "Kategori"
                          : field === "image"
                          ? "Görsel URL"
                          : field === "subject"
                          ? "Filmin Konusu"
                          : "Çıkış Yılı"}
                      </label>
                      {field === "category" ? (
                        <select
                          name="category"
                          className="form-select"
                          value={form.category}
                          onChange={handleChange}
                        >
                          <option value="">Seçiniz</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field === "year" ? "number" : "text"}
                          name={field}
                          className="form-control"
                          value={form[field]}
                          onChange={handleChange}
                        />
                      )}
                    </div>
                  )
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingMovie(null)}
                >
                  İptal
                </button>
                <button className="btn btn-success" onClick={handleUpdate}>
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
