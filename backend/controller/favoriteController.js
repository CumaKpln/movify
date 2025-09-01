const Favorite = require("../models/favoriteModel");
const Movie = require("../models/movieModel");
const User = require("../models/userModel");

// Favorilere ekle
exports.addFavorite = async (req, res) => {
  const { userId } = req.params;
  const { movieId } = req.body;

  // Giriş kontrolü
  if (!userId) {
    return res
      .status(401)
      .json({ message: "Favorilere ekleyebilmek için giriş yapmalısınız" });
  }
  try {
    const favorite = await Favorite.create({
      userId,
      movieId,
    });
    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Favorilere eklenirken hata oluştu" });
  }
};

// Kullanıcının favori filmleri (film detayları ile)
exports.getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [{ model: Movie, as: "movie" }],
    });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/favorites/:id → favoriyi sil
exports.removeFavorite = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.body.userId || req.query.userId; // frontend'ten al

    // Giriş kontrolü
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Favorileri kaldırabilmek için giriş yapmalısınız" });
    }

    const favorite = await Favorite.findOne({
      where: { userId, movieId },
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favori bulunamadı" });
    }

    await favorite.destroy();
    res.json({ message: "Favori başarıyla silindi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Favori silinirken hata oluştu" });
  }
};
