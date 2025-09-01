const Category = require("../models/categoryModel");

// Tüm kategorileri çekiyor
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories); // JSON olarak frontend'e gönder
  } catch (err) {
    console.error("Kategoriler alınamadı:", err);
    res.status(500).json({ error: "Kategoriler alınamadı" });
  }
};
