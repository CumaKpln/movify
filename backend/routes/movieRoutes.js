const express = require("express");
const router = express.Router();
const Movie = require("../models/movieModel");
const User = require("../models/userModel");
const Actor = require("../models/actorModel");
const MovieActor = require("../models/movies_actors");
const Category = require("../models/categoryModel");
require("../models/relationship");
const movieController = require("../controller/movieController");

// GET /api/movies → tüm filmleri döner
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.findAll({
      attributes: [
        "id",
        "name",
        "subject",
        "year",
        "image",
        "categoryId",
        "userId",
      ],
      raw: true,
    });
    res.json(movies);
    console.log(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/movies → film ekle
router.post("/", async (req, res) => {
  try {
    const { actors, userId, ...movieData } = req.body;
    const newMovie = await Movie.create({ ...movieData, userId });

    if (actors && Array.isArray(actors) && actors.length > 0) {
      const createdActors = await Actor.bulkCreate(actors);
      await newMovie.addActors(createdActors.map((a) => a.id));
    }

    res.status(201).json(newMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/movies/:userId → userId'ye göre filmleri döner
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

    const movies = await Movie.findAll({ where: { userId } });
    res.json(movies);
  } catch (err) {
    console.error("Backend Hatası:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/movies/:userId/:movieId → film sil
router.delete("/:movieId", movieController.deleteMovie);

// GET /api/movies/detail/:id → id'ye göre film detayı döner
router.get("/detail/:id", async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: "Film bulunamadı" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/movies/:id → film güncelle
router.put("/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    const { name, year, subject, image, category, actors } = req.body;
    const movie = await Movie.findByPk(movieId);
    if (!movie) return res.status(404).json({ error: "Film bulunamadı" });

    // 1️⃣ Movie tablosunu güncelle
    await movie.update({ name, year, subject, image });

    // 2️⃣ Category güncelle
    if (category) {
      const cat = await Category.findOne({ where: { name: category } });
      if (cat) {
        movie.categoryId = cat.id;
        await movie.save();
      }
    }

    // 3️⃣ Actors güncelle
    if (Array.isArray(actors)) {
      // önce pivot tablodan eski actorları sil
      await MovieActor.destroy({ where: { movieId: movie.id } });
      // actorları ekle
      for (let a of actors) {
        let actor = await Actor.findOne({ where: { name: a.name } });
        if (!actor) actor = await Actor.create({ name: a.name, age: a.age });
        await MovieActor.create({ movieId: movie.id, actorId: actor.id });
      }
    }

    res.json({ message: "Film, kategori ve oyuncular başarıyla güncellendi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
