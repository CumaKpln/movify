import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  console.log(token);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/verify/${token}`
        );
        toast.success(res.data.message); // "E-posta başarıyla doğrulandı..."
        navigate("/login"); // doğrulama sonrası login sayfasına yönlendir
      } catch (err) {
        const msg =
          err.response?.data?.message || "Doğrulama sırasında bir hata oluştu";
        toast.error(msg);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="container my-5 text-center">
      {loading ? (
        <h4>📩 E-posta doğrulanıyor...</h4>
      ) : (
        <h4>Yönlendiriliyorsunuz...</h4>
      )}
    </div>
  );
};

export default VerifyEmail;
