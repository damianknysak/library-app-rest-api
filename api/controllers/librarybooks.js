const mongoose = require("mongoose");
const LibraryBook = require("../models/librarybook");

exports.get_books_from_library = async (req, res, next) => {
  try {
    const LIMIT = 15;
    const PAGE = req.query.page && req.query.page > 1 ? req.query.page - 1 : 0;

    const librarybookcopy = await LibraryBook.find(
      {
        userId: req.userData.userId,
      },
      null,
      { skip: LIMIT * PAGE, limit: LIMIT }
    );

    res.status(200).json({
      message: "List of books in /librarybooks",
      page: PAGE < 1 ? 1 : PAGE + 1,
      length: librarybookcopy.length,
      libraryBooks: librarybookcopy,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.add_book_to_library = async (req, res, next) => {
  try {
    if (req.body.bookUrl) {
      const librarybookcopy = await LibraryBook.find({
        userId: req.userData.userId,
        bookUrl: req.body.bookUrl,
      });

      if (librarybookcopy.length > 0) {
        return res.status(400).json({
          message: "Book already added to library",
        });
      }

      const like = new LibraryBook({
        _id: new mongoose.Types.ObjectId(),
        userId: req.userData.userId,
        bookUrl: req.body.bookUrl,
        book: req.body.book,
      });

      const result = await like.save();

      res.status(201).json({
        message: "Handling POST requests to /LibraryBook",
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

exports.remove_book_from_library = async (req, res, next) => {
  try {
    if (req.body.bookUrl) {
      const librarybookcopy = await LibraryBook.find({
        userId: req.userData.userId,
        bookUrl: req.body.bookUrl,
      });

      if (librarybookcopy.length > 0) {
        await LibraryBook.deleteMany({
          userId: req.userData.userId,
          bookUrl: req.body.bookUrl,
        });
        return res.status(200).json({
          message: "Book deleted from library",
        });
      }
      res.status(404).json({
        message: "Book doesn't exist in library",
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

exports.check_book_in_library = async (req, res, next) => {
  try {
    console.log("HELLo");
    const bookUrl = req.body.bookUrl;
    const userId = req.userData.userId;

    const librarybook = await LibraryBook.find({
      bookUrl: bookUrl,
      userId: userId,
    });

    if (!bookUrl || !userId) {
      return res.status(400).json({
        message: "Missing arguments",
      });
    }
    if (librarybook.length < 1) {
      return res.status(414).json({
        message: "Not found",
      });
    }

    res.status(200).json({
      message: "User has this book in library",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
