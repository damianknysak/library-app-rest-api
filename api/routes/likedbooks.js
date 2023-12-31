const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/checkAuth");
const LikedBooksController = require("../controllers/likedbooks");

router.get("/", checkAuth, LikedBooksController.get_liked_books);

router.get("/stats", checkAuth, LikedBooksController.get_liked_books_stats);

router.get(
  "/recommendations",
  checkAuth,
  LikedBooksController.get_recommendations
);

router.post("/add", checkAuth, LikedBooksController.add_like);

router.post("/remove", checkAuth, LikedBooksController.remove_like);

router.post("/check", checkAuth, LikedBooksController.check_like);

module.exports = router;
