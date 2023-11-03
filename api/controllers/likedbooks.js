const mongoose = require("mongoose");
const LikedBook = require("../models/likedbook");

exports.add_like = async (req, res, next) => {
  try {
    if (req.body.bookUrl) {
      const likedbookcopy = await LikedBook.find({
        userId: req.userData.userId,
        bookUrl: req.body.bookUrl,
      });

      if (likedbookcopy.length > 0) {
        return res.status(400).json({
          message: "Book already liked",
        });
      }

      const like = new LikedBook({
        _id: new mongoose.Types.ObjectId(),
        userId: req.userData.userId,
        bookUrl: req.body.bookUrl,
      });

      const result = await like.save();

      res.status(201).json({
        message: "Handling POST requests to /likedbooks",
        createdBook: result,
      });
    } else {
      res.status(403).json({
        message: `Wrong request`,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.remove_like = async (req, res, next) => {
  try {
    if (req.body.bookUrl) {
      const likedbookcopy = await LikedBook.find({
        userId: req.userData.userId,
        bookUrl: req.body.bookUrl,
      });

      if (likedbookcopy.length > 0) {
        await LikedBook.deleteMany({
          userId: req.userData.userId,
          bookUrl: req.body.bookUrl,
        });
        return res.status(200).json({
          message: "Like deleted",
        });
      }
      res.status(400).json({
        message: "Like already exists",
      });
    } else {
      res.status(403).json({
        message: `Wrong request`,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
