const mongoose = require("mongoose");
const LikedBook = require("../models/likedbook");

exports.get_liked_books = async (req, res, next) => {
  try {
    const LIMIT = 15;
    const PAGE = req.query.page && req.query.page > 1 ? req.query.page - 1 : 0;

    const likedbookcopy = await LikedBook.find(
      {
        userId: req.userData.userId,
      },
      null,
      { skip: LIMIT * PAGE, limit: LIMIT }
    );

    if (likedbookcopy.length < 1) {
      return res.status(404).json({
        message: "No likedbooks",
      });
    }
    res.status(200).json({
      message: "List of books in /likedbooks",
      page: PAGE < 1 ? 1 : PAGE + 1,
      length: likedbookcopy.length,
      likedBooks: likedbookcopy,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

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
      res.status(404).json({
        message: "Like doesn't exist",
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

exports.check_like = async (req, res, next) => {
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
};
