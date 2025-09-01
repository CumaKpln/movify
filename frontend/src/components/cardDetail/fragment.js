import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Fragment = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/movies/detail/${id}`
        );
        setMovie(res.data);
      } catch (error) {
        console.error("Film alınamadı:", error);
      }
    };
    if (id) fetchImage();
  }, [id]);

  return (
    <>
      {movie && (
        <div className="movie-details">
          <h2 className="my-3">
            <b>{movie.name}</b>
          </h2>
        </div>
      )}

      <div
        id="carouselExampleSlidesOnly"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={
                movie?.image ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOFQ1S7RDrRK5bCl0En6J0IGb2kY6AOhkwsA&s"
              }
              className="card-img-top"
              alt={movie?.name || "Film"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Fragment;
