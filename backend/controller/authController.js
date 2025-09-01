const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sendEmail = require("../mailVerification/sendMail");
const sendError = require("../mailVerification/sendError");
const nodemailer = require("nodemailer");

const generateToken = (payload, expiresIn = "1d") =>
  jwt.sign(payload, process.env.SESSION_TOKEN, { expiresIn });

// ------------------- GİRİŞ YAP -------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return sendError(res, 400, "Email ve şifre zorunlu");

    const user = await User.findOne({ where: { email } });
    if (!user) return sendError(res, 400, "Kullanıcı bulunamadı");

    // Mail doğrulamasını kontrol et
    if (!user.isVerified) {
      return sendError(res, 401, "Lütfen önce e-posta adresinizi doğrulayın");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendError(res, 400, "Şifre yanlış");

    const token = generateToken({ userId: user.id, email: user.email });

    res.json({
      message: "Giriş başarılı",
      token,
      userId: user.id,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    sendError(res, 500, "Giriş yapılamadı");
  }
};

// ------------------- KAYIT OL -------------------
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return sendError(res, 400, "Tüm alanlar zorunlu");

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return sendError(res, 400, "Email zaten kayıtlı");

    // Şifre hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Rastgele doğrulama tokeni oluştur
    const verificationToken = crypto.randomBytes(32).toString("hex");

    console.log("register verificationToken:", verificationToken);

    // Kullanıcıyı oluştur
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    // Mail gönder
    await sendMail(verificationToken, email);

    res.status(201).json({
      message: "Kullanıcı oluşturuldu. Lütfen e-posta adresinizi doğrulayın.",
      userId: user.id,
    });
  } catch (err) {
    console.error(err);
    sendError(res, 500, "Kullanıcı oluşturulamadı");
  }
};

// ------------------- MAIL GÜNCELLEME -------------------
exports.updateEmail = async (req, res) => {
  try {
    const { currentPassword, newEmail } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, 404, "Kullanıcı bulunamadı ❌");

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return sendError(res, 400, "Şifre yanlış ❌");

    await user.update({ email: newEmail });
    res.json({ message: "E-posta başarıyla güncellendi ✅" });
  } catch (err) {
    console.error(err);
    sendError(res, 500, "Bir hata oluştu ❌");
  }
};

//  Şifre sıfırlama linki gönderme
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return sendError(res, 404, "Bu e-posta adresi kayıtlı değil ❌");

    // Token oluştur
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 1000 * 60 * 15; // 15 dakika geçerli

    await user.update({
      resetToken,
      resetExpires,
    });

    console.log(resetToken, "backend");

    // Reset linki (frontend reset sayfanı koy)
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Mail gönder
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Outlook/SMTP ayarlayabilirsin
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Şifre Sıfırlama" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Şifre Sıfırlama Linki",
      html: `
        <h2>Merhaba ${user.name || ""},</h2>
        <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Bu link 15 dakika geçerlidir.</p>
      `,
    });

    res.json({
      message: "Şifre sıfırlama linki mail adresinize gönderildi ✅",
    });
  } catch (err) {
    console.error(err);
    sendError(res, 500, "Mail gönderilirken hata oluştu ❌");
  }
};

//  Senin resetPassword fonksiyonun (değişmeden)
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Token ile kullanıcıyı bul
    const user = await User.findOne({ where: { resetToken: token } });
    if (!user) return sendError(res, 404, "Kullanıcı bulunamadı ❌");

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Şifreyi güncelle ve tokeni sıfırla
    await user.update({
      password: hashedPassword,
      resetToken: null,   // ✅ tek kullanımlık link olsun diye sıfırlıyoruz
      resetExpires: null, // ✅ tarih de sıfırlanıyor
    });

    res.json({ message: "Şifre başarıyla güncellendi ✅" });
  } catch (err) {
    console.error(err);
    sendError(res, 500, "Bir hata oluştu ❌");
  }
};


// E-posta doğrulama
exports.verifyEmail = async (req, res) => {
  try {
    console.log(req.params, "register");
    const { token } = req.params;

    // Token ile kullanıcıyı bul
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return sendError(res, 400, "Geçersiz veya süresi dolmuş doğrulama linki");
    }

    // Kullanıcıyı doğrula
    user.isVerified = true;
    user.verificationToken = null; // token artık kullanılmasın
    await user.save();

    res.status(200).json({
      message: "E-posta başarıyla doğrulandı. Artık giriş yapabilirsiniz.",
    });
  } catch (err) {
    console.error(err);
    sendError(res, 500, "E-posta doğrulama başarısız");
  }
};
