  import React, { useEffect, useState } from "react";
  import axios from "axios";

  export default function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      axios
        .get(`http://localhost:5000/api/favorites/${userId}`)
        .then((res) => setFavorites(res.data))
        .catch((err) => console.error(err));
    }, []);

    const removeFavorite = async (movieId) => {
      try {
        const userId = localStorage.getItem("userId");
        await axios.delete(`http://localhost:5000/api/favorites/${movieId}`, {
          data: { userId }, // hem userId hem movieId backend’e gidecek
        });

        // movieId'ye göre filtrele
        setFavorites(favorites.filter((fav) => fav.movieId !== movieId));
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div className="container my-5">
        <h2 className="fw-bold mb-4">⭐ Favorilerim</h2>

        {favorites.length === 0 ? (
          <div className="text-center p-5 border rounded-4 bg-light shadow-sm">
            <i
              className="bi bi-heart text-danger"
              style={{ fontSize: "3rem" }}
            ></i>
            <h4 className="mt-3">Henüz favoriniz yok</h4>
            <p className="text-muted">
              Beğendiğiniz filmleri favorilere ekleyerek buradan ulaşabilirsiniz.
            </p>
            <a href="/" className="btn btn-primary mt-2">
              🎬 Filmleri Keşfet
            </a>
          </div>
        ) : (
          <div className="row">
            {favorites.map((fav) => (
              <div className="col-md-4 mb-4" key={fav.id}>
                <div className="card shadow-sm border-0 h-100 rounded-4">
                  {fav.movie?.image && (
                    <img
                      src={fav.movie.image}
                      alt={fav.movie.name}
                      className="card-img-top rounded-top-4"
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{fav.movie?.name}</h5>
                    <p className="text-muted mb-2">{fav.movie?.year}</p>
                    <p
                      className="card-text flex-grow-1"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {fav.movie?.subject}
                    </p>
                    <button
                      className="btn btn-outline-danger btn-sm mt-auto"
                      // movieId gönder → backend hem userId hem movieId alacak
                      onClick={() => removeFavorite(fav.movieId)}
                    >
                      <i className="bi bi-trash me-2"></i> Favorilerden Kaldır
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
