import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Comments = () => {
  const navigate = useNavigate();
  const { id: movieId } = useParams();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // ✅ Yorumları yükle
  const loadComments = async () => {
    if (!movieId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/comments/${movieId}`
      );
      setComments(
        res.data.map((c) => ({
          ...c,
          userName: c.user?.name || "Anonim",
          createdAt: c.createdAt,
        }))
      );
    } catch (err) {
      console.error("Yorumlar alınamadı:", err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [movieId]);

  // ✅ Yorum ekle
  const handleSendComment = async () => {
    if (!token) {
      const goLogin = window.confirm(
        "Yorum yapabilmek için giriş yapmalısınız. Giriş yapmak ister misiniz?"
      );
      if (goLogin) navigate("/login");
      return;
    }

    if (!commentText.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/comments",
        { movieId, text: commentText, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText("");
      loadComments();
    } catch (err) {
      console.error("Yorum eklenemedi:", err);
    }
  };

  // ✅ Yorum sil
  const handleDelete = async (commentId) => {
    if (!window.confirm("Bu yorumu silmek istediğinizden emin misiniz?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadComments();
    } catch (err) {
      console.error("Yorum silinemedi:", err);
    }
  };

  // ✅ Inline düzenleme başlat
  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  // ✅ Inline düzenleme kaydet
  const saveEdit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditText("");
      loadComments();
    } catch (err) {
      console.error("Yorum düzenlenemedi:", err);
    }
  };

  return (
    <div className="container my-5">
      {/* Yorum yapma alanı */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-5">
        <h4 className="fw-bold mb-3"> Yorum Yap</h4>
        <div className="d-flex flex-column flex-md-row gap-3">
          <i className="bi bi-person-circle fs-2 text-secondary"></i>
          <div className="flex-grow-1">
            <textarea
              className="form-control rounded-3 mb-2 border-2"
              rows="3"
              placeholder="Yorumunuzu yazın..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ transition: "0.2s" }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(13,110,253,.6)")
              }
              onBlur={(e) => (e.target.style.borderColor = "#dee2e6")}
            />
            <div className="text-end">
              <button
                className="btn btn-primary px-4 py-2 rounded-pill shadow-sm"
                onClick={handleSendComment}
                style={{ transition: "0.3s" }}
               
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Yorumlar listesi */}
      <div>
        <h5 className="fw-bold mb-4 d-flex align-items-center">
          <i className="bi bi-chat-left-text me-2 text-primary"></i>
          Yorumlar
          <span className="badge bg-primary rounded-pill ms-2 fs-6">
            {comments.length}
          </span>
        </h5>

        {comments.length === 0 ? (
          <p className="text-muted fst-italic text-center">
            Henüz yorum yapılmamış. İlk yorumu siz yapın!
          </p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {comments.map((c, idx) => {
              const date = new Date(c.createdAt);
              const formattedDate = date.toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
              const formattedTime = date.toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={idx}
                  className="card p-3 shadow-sm border-0 rounded-4"
                  style={{ transition: "0.3s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-3px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-person-circle fs-3 text-secondary"></i>
                      <strong>{c.userName}</strong>
                    </div>

                    {/* ✅ Üç nokta menüsü */}
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-light border-0"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => startEdit(c)}
                          >
                            Düzenle
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleDelete(c.id)}
                          >
                            Sil
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {editingId === c.id ? (
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control"
                        value={editText}
                        autoFocus
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(c.id);
                          if (e.key === "Escape") {
                            setEditingId(null);
                            setEditText("");
                          }
                        }}
                      />
                      <button
                        className="btn btn-success"
                        onClick={() => saveEdit(c.id)}
                      >
                        Kaydet
                      </button>
                    </div>
                  ) : (
                    <p className="mb-0 text-secondary">{c.text}</p>
                  )}

                  <small className="text-muted">
                    {formattedDate}, {formattedTime}
                  </small>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
