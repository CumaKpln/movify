import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MoviesPlayers = () => {
  const { id } = useParams();
  const [actors, setActors] = useState([]);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies_actors/${id}`);
        setActors(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (error) {
        console.error("Oyuncu alınamadı:", error);
      }
    };
    if (id) fetchActors();
  }, [id]);

  return (
    <div className="container">
      <h3 className="text-center fw-bold mb-4">Oyuncular</h3>

      {actors.length > 0 ? (
        <div className="row g-3">
          {actors.map((actor, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-md-12">
              <div className="actor-card p-3 rounded-4 bg-white h-100 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-dark fw-semibold">{actor?.name || "İsim yok"}</h5>
                <span className="age-badge">
                  {actor?.age ? `${actor.age} yaşında` : "Yaş bilgisi yok"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted mt-5">Oyuncu bilgisi bulunamadı...</p>
      )}

      <style>
        {`
          .actor-card {
            border: 1px solid #eee;
            transition: all 0.2s ease-in-out;
          }
          .actor-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          .age-badge {
            font-size: 0.9rem;
            background: #f8f9fa;
            color: #444;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 500;
          }
        `}
      </style>
    </div>
  );
};

export default MoviesPlayers;
