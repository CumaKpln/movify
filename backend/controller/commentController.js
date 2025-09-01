const Comment = require("../models/commentModel");
const User = require("../models/userModel");
require("../models/relationship");

// Filme yorum ekle
exports.addCommentToMovie = async (req, res) => {
  try {
    const { movieId, userId, text } = req.body;
    if (!movieId || !text || !userId) {
      return res.status(400).json({ error: "movieId, text ve userId zorunlu" });
    }

    const comment = await Comment.create({ movieId, userId, text });
    res.status(201).json(comment);
  } catch (err) {
    console.error("Yorum eklenemedi:", err);
    res.status(500).json({ error: "Yorum eklenemedi" });
  }
};

// Filme ait yorumları getir (User bilgisi ile birlikte)

exports.getCommentsByMovieId = async (req, res) => {
  try {
    // URL parametrelerinden movieId değerini al
    const { movieId } = req.params;

    // Eğer movieId yoksa, 400 Bad Request hatası gönder
    if (!movieId) {
      return res.status(400).json({ error: "movieId gerekli" });
    }

    // Veritabanından yorumları çek
    const comments = await Comment.findAll({
      where: { movieId },
      attributes: ["id", "text", "createdAt"],
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt"]],
    });

    // Bulunan yorumları JSON formatında frontend'e gönder
    res.json(comments);
  } catch (err) {
    // Hata oluşursa konsola yazdır ve 500 Internal Server Error döndür
    console.error("Yorumlar alınamadı:", err);
    res.status(500).json({ error: "Yorumlar alınamadı" });
  }
};

// Belirli bir yorumu sil
 exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Eğer id yoksa, 400 Bad Request hatası gönder
    if (!id) {
      return res.status(400).json({ error: "id gerekli" });
    }

    // Yorum silme işlemi
    const deleted = await Comment.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Yorum bulunamadı" });
    }

    res.status(204).send(); // Başarılı silme işlemi
  } catch (err) {
    console.error("Yorum silinemedi:", err);
    res.status(500).json({ error: "Yorum silinemedi" });
  }
};

// Belirli bir yorumu güncelle
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Eğer id veya text yoksa, 400 Bad Request hatası gönder
    if (!id || !text) {
      return res.status(400).json({ error: "id ve text zorunlu" });
    }

    // Yorum güncelleme işlemi
    const [updated] = await Comment.update({ text }, { where: { id } });

    if (!updated) {
      return res.status(404).json({ error: "Yorum bulunamadı" });
    }

    res.status(200).json({ message: "Yorum güncellendi" });
  } catch (err) {
    console.error("Yorum güncellenemedi:", err);
    res.status(500).json({ error: "Yorum güncellenemedi" });
  }
};