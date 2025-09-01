import React, { useState, useEffect } from "react";
import axios from "axios";
import ActorInput from "../actorInput";

const AddMovie = () => {
  const [movie, setMovie] = useState({
    name: "",
    subject: "",
    image: "",
    categoryId: "",
    year: "",
    actors: [{ name: "", age: "" }],
  });

  const [categories, setCategories] = useState([]);

  // Kategorileri getir
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Kategori alınamadı:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleActorChange = (index, field, value) => {
    const updatedActors = [...movie.actors];
    updatedActors[index][field] = value;
    setMovie({ ...movie, actors: updatedActors });
  };

  const addActor = () => {
    setMovie({ ...movie, actors: [...movie.actors, { name: "", age: "" }] });
  };

  const removeActor = (index) => {
    setMovie({
      ...movie,
      actors: movie.actors.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Eklenen Film:", movie);

    // Film ekleme isteği
    const userId = localStorage.getItem("userId");
    try {
      await axios.post("http://localhost:5000/api/movies", { ...movie, userId });
      alert("Film başarıyla eklendi!");
      setMovie({
        name: "",
        subject: "",
        image: "",
        categoryId: "",
        year: "",
        actors: [{ name: "", age: "" }],
      });
    } catch (error) {
      console.error("Film eklenirken hata:", error);
    }
  };
  return (
    <div className="container my-4">
      <h3>🎬 Film Ekle</h3>
      <form className="border p-4 rounded shadow" onSubmit={handleSubmit}>
        {/* Film Adı */}
        <div className="mb-3">
          <label className="form-label">Film Adı</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={movie.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Kategori */}
        <div className="mb-3">
          <label className="form-label">Kategori</label>
          <select
            className="form-select"
            name="categoryId"
            value={movie.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Kategori seçiniz</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Görsel URL */}
        <div className="mb-3">
          <label className="form-label">Görsel URL</label>
          <input
            type="url"
            className="form-control"
            name="image"
            value={movie.image}
            onChange={handleChange}
            required
          />
        </div>

        {/* Filmin Konusu */}
        <div className="mb-3">
          <label className="form-label">Filmin Konusu</label>
          <textarea
            className="form-control"
            rows="3"
            name="subject"
            value={movie.subject}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Çıkış Yılı */}
        <div className="mb-3">
          <label className="form-label">Çıkış Yılı</label>
          <input
            type="number"
            className="form-control"
            name="year"
            placeholder="Örn: 2025"
            value={movie.year}
            onChange={handleChange}
            required
          />
        </div>

        {/* Oyuncular */}
        <div className="mb-3">
          <ActorInput
            actors={movie.actors}
            onChange={handleActorChange}
            onAdd={addActor}
            onRemove={removeActor}
          />
        </div>

        {/* Gönder Butonu */}
        <button type="submit" className="btn btn-primary">
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
