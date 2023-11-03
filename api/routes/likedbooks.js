const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const checkAuth = require("../middleware/checkAuth");
const LikedBooksController = require("../controllers/likedbooks");
const LikedBook = require("../models/likedbook");

router.post("/add", checkAuth, LikedBooksController.add_like);

router.post("/remove", checkAuth, LikedBooksController.remove_like);

router.post("/check", checkAuth, async (req, res, next) => {
  try {
    console.log("HELLo");
    const bookUrl = req.body.bookUrl;
    const userId = req.userData.userId;

    const likedBook = await LikedBook.find({
      bookUrl: bookUrl,
      userId: userId,
    });

    if (!bookUrl || !userId) {
      return res.status(400).json({
        message: "Missing arguments",
      });
    }
    if (likedBook.length < 1) {
      return res.status(414).json({
        message: "Not found",
      });
    }

    res.status(200).json({
      message: "User has liked this book",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
