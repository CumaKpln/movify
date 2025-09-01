import React from "react";
import Fragment from "../cardDetail/fragment";
import Subject from "../cardDetail/subject";
import Comments from "../cardDetail/comments";
import MoviesPlayers from "../cardDetail/moviesPlayers";
import Favorites from "../cardDetail/favorites";

const cardDetail = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-9">
          <Fragment />
          <Subject />
        </div>
        <div className="col-md-3">
          <Favorites />
          <MoviesPlayers />
        </div>
      </div>
      <Comments />
    </div>
  );
};

export default cardDetail;
