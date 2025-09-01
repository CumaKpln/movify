const Movie = require("../models/movieModel");
const Actor = require("../models/actorModel");
require("../models/relationship");

// Tüm Filmleri çekiyor
exports.getCategories = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.json(movies); // JSON olarak frontend'e gönder
  } catch (err) {
    console.error("Filmler alınamadı:", err);
    res.status(500).json({ error: "Filmler alınamadı" });
  }
};

// Yeni film ekliyor (actors ile birlikte)
exports.createMovie = async (req, res) => {
  try {
    const { actors, ...movieData } = req.body; // actors: [{name, age}, ...]

    // Film ekle
    const newMovie = await Movie.create(movieData);

    // Aktörler dizi olarak geldiyse önce ekle, sonra ilişkilendir
    if (actors && Array.isArray(actors) && actors.length > 0) {
      // Aktörleri topluca ekle
      const createdActors = await Actor.bulkCreate(actors);
      // İlişkiyi kur (ara tabloya kaydeder)
      await newMovie.addActors(createdActors.map((a) => a.id));
    }

    // Film ve ilişkili aktörleri birlikte döndür
    const movieWithActors = await Movie.findByPk(newMovie.id, {
      include: [
        { model: Actor, as: "actors", attributes: ["id", "name", "age"] },
      ],
    });

    res.status(201).json(movieWithActors);
  } catch (err) {
    console.error("Film eklenemedi:", err);
    res.status(500).json({ error: err.message });
  }
};

// Kullanıcı ekleme ve film güncelleme işlemleri
exports.setupDatabase = async (req, res) => {
  try {
    // Öncelikle kullanıcıyı ekle
    await User.create({
      id: 1,
      name: "test",
      email: "test@test.com",
      password: "123456",
    });

    // Daha sonra, filmleri güncelle
    await Movie.update({ userId: 1 }, { where: { userId: null } });

    res.status(200).json({ message: "Veritabanı başarıyla güncellendi." });
  } catch (err) {
    console.error("Veritabanı güncellenemedi:", err);
    res.status(500).json({ error: "Veritabanı güncellenemedi" });
  }
};

exports.deleteMovie = async (req, res) => {
  const { movieId } = req.params;

  // 3️⃣ Artık join tablosunda ilişkisi kalmayan actorleri sil
  const orphanActors = await Actor.findAll({
    include: {
      model: Movie,
      required: false,
    },
  });

  for (const Actor of orphanActors) {
    const movies = await Actor.getMovies();
    if (movies.length === 0) {
      await Actor.destroy();
    }
  }

  try {
    const deleted = await Movie.destroy({
      where: { id: movieId }, // userId kontrolü ile güvence
    });

    if (!deleted) {
      return res.status(404).json({ message: "Film bulunamadı" });
    }

    res.json({ message: "Film başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
