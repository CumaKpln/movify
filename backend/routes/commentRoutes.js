const express = require("express");
const router = express.Router();
const commentController = require("../controller/commentController");

// POST /api/comments → filme yorum ekler
router.post("/", commentController.addCommentToMovie);

// GET /api/comments/:movieId → filme ait yorumları getirir
router.get("/:movieId", commentController.getCommentsByMovieId);

// DELETE /api/comments/:id → belirli bir yorumu siler
router.delete("/:id", commentController.deleteComment);

// PUT /api/comments/:id → belirli bir yorumu günceller
router.put("/:id", commentController.updateComment);

module.exports = router;