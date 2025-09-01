const Actor = require("../models/actorModel");
const Movie = require("../models/movieModel");
const express = require("express");
const router = express.Router();

// Bir film id'sine ait aktörleri getir
exports.getActorsByMovieId = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findByPk(movieId, {
      include: [{ model: Actor, as: "actors", attributes: ["id", "name", "age"] }]
    });
    if (!movie) return res.status(404).json({ error: "Film bulunamadı" });
    res.json(movie.actors);
  } catch (err) {
    console.error("Aktörler alınamadı:", err);
    res.status(500).json({ error: "Aktörler alınamadı" });
  }
};

// Oyuncu eklerken oynadığı filmleri de ekle
exports.createActorWithMovies = async (req, res) => {
  try {
    const { name, age, movieIds } = req.body;
    const actor = await Actor.create({ name, age });
    if (movieIds && Array.isArray(movieIds)) {
      await actor.setMovies(movieIds); // Ara tabloya ekler
    }
    const actorWithMovies = await Actor.findByPk(actor.id, {
      include: [{ model: Movie, as: "movies", attributes: ["id", "name"] }]
    });
    res.status(201).json(actorWithMovies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Bir oyuncunun oynadığı filmleri getir
exports.getActorMovies = async (req, res) => {
  try {
    const actor = await Actor.findByPk(req.params.id);
    if (!actor) return res.status(404).json({ error: "Oyuncu bulunamadı" });
    const movies = await actor.getMovies({ attributes: ["id", "name"] });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Oyuncu güncelleme
exports.updateActor = async (req, res) => {
  try {
    const actor = await Actor.findByPk(req.params.id);
    if (!actor) return res.status(404).json({ error: "Oyuncu bulunamadı" });

    const { name, age } = req.body;
    await actor.update({ name, age });
    res.json({ message: "Oyuncu başarıyla güncellendi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
