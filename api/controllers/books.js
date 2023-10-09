const mongoose = require("mongoose");
const Book = require("../models/book");

exports.add_book = async (req, res, next) => {
  try {
    const book = new Book({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
    });

    const result = await book.save();

    res.status(201).json({
      message: "Handling POST requests to /books",
      createdBook: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err,
    });
  }
};
