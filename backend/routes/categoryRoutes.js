const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel");

////// OYNAMA DOĞRU BURASI //////

// GET /api/categories → tüm kategorileri döner
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name"],
      raw: true,
    });
    console.log(categories)
    res.json(categories); // JSON olarak frontend'e gönder
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categories → yeni kategori ekler
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
