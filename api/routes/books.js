const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/book");
const Book = require("../models/book");
const checkAuth = require("../middleware/checkAuth");
const BooksController = require("../controllers/books");

router.post("/", checkAuth, BooksController.add_book);

router.get("/", checkAuth, (req, res, next) => {
  try {
    res.status(200).json({
      message: req.userData.userId,
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
});

router.get("/:bookId", (req, res, next) => {
  const id = req.params.bookId;
  res.status(200).json({
    message: `Book number ${id}`,
  });
});

module.exports = router;
