const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Movie = require("../models/movieModel");
const Actor = require("../models/actorModel");
const crypto = require("crypto");
const sendEmail = require("../mailVerification/sendMail");

// Tüm kullanıcıları getir
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["id", "name", "email"] });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kullanıcılar alınamadı" });
  }
};

// Kullanıcıya ait filmleri getir
exports.getUserMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({
      where: { userId: req.params.userId },
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Tek bir kullanıcıyı id ile getir
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email"],
    });
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kullanıcı alınamadı" });
  }
};

// Kullanıcı oluştur
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Alan kontrolü
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Tüm alanlar zorunlu" });
    }

    // Email daha önce var mı kontrol et
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email zaten kayıtlı" });
    }

    // Password hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // Doğrulama tokenı oluştur
    const verificationToken = crypto.randomBytes(32).toString("hex");
    // Kullanıcı oluştur
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });
    await sendEmail(verificationToken, email);
    res.status(201).json({ message: "Kullanıcı oluşturuldu", userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kullanıcı oluşturulamadı" });
  }
};

// Kullanıcıyı güncelle
exports.updateUser = async (req, res) => {
  try {
    const { currentPassword, newEmail } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

    // Mevcut şifre kontrolü
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ error: "Mevcut şifre yanlış ❌" });
    }

    // E-posta güncelle
    await user.update({ email: newEmail });
    res.json({ message: "E-posta başarıyla güncellendi ✅", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Güncelleme yapılamadı ❌" });
  }
};

// Kullanıcıyı sil
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // 1️⃣ User'ı bul
    const user = await User.findByPk(userId, {
      include: [Movie],
    });
    console.log(user, "user bulundu");
    if (!user) return res.status(404).json({ message: "User bulunamadı" });

    // 2️⃣ User'a ait tüm filmleri sil
    for (const movie of user.movies) {
      await movie.destroy(); // cascade ile comments, favorites, join table silinir
      console.log(movie, "cascade sorunu");
    }

    // 3️⃣ User'ı sil
    await user.destroy();
    console.log(user, "user silindi");
    // 4️⃣ Boşta kalan oyuncuları temizle
    const orphanActors = await Actor.findAll({
      include: {
        model: Movie,
        required: false,
      },
    });
    console.log(orphanActors, "boşta kalan oyuncular");

    for (const actor of orphanActors) {
      const movies = await actor.getMovies();
      if (movies.length === 0) {
        await actor.destroy();
      }
    }

    res.json({ message: "User ve ilişkili tüm veriler silindi 🚀" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUserMovie = async (req, res) => {
  try {
    const { id, movieId } = req.params;
    // Kullanıcıyı kontrol et
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

    // Kullanıcının movies tablosundan ilgili filmi sil
    const movie = await Movie.findOne({
      where: { id: movieId, userId: id }, // userId ile filtreleme
    });

    if (!movie) return res.status(404).json({ error: "Film bulunamadı" });

    await movie.destroy();
    res.json({ message: "Film başarıyla silindi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Film silinemedi" });
  }
};
