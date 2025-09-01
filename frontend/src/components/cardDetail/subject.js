import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Subject = () => {
  const { id } = useParams(); // useParams component içinde olmalı
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/detail/${id}`);
        setSubject(res.data);
      } catch (error) {
        console.error("Film alınamadı:", error);
      }
    };
    if (id) fetch();
  }, [id]);

  return (
    <div className="my-3 fs-5 fw-normal">
      <b>Filmin Konusu</b> <br />
      {subject ? subject.subject : "Yükleniyor..."}
    </div>
  );
};

export default Subject;
