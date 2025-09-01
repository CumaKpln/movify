const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

// Kullanıcı kayıt
router.post("/register", authController.register);

// Kullanıcı giriş
router.post("/login", authController.login);

// E-posta doğrulama
router.get("/verify/:token", authController.verifyEmail);

// E-posta güncelleme
router.put("/update-email/:id", authController.updateEmail);

// Şifremi unuttum
router.post("/reset-password", authController.forgotPassword);

// Şifre sıfırlama
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
