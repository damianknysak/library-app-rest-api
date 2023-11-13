const mongoose = require("mongoose");
const LikedBook = require("../models/likedbook");
const { findMostFrequent, formatStringForQuery } = require("../utils/utils");

exports.get_recommendations = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const likedbooks = await LikedBook.find({ userId: userId });

    const subjectsArray = [];

    likedbooks.forEach((element) => {
      if (Array.isArray(element.book.bookDetails.subjects))
        subjectsArray.push(...element.book.bookDetails.subjects);
    });

    const topSubjects = findMostFrequent(subjectsArray).map(
      (element) => element.el
    );

    const booksSubjectsArray = [];

    for (const subject of topSubjects) {
      const response = await fetch(
        `https://openlibrary.org/subjects/${formatStringForQuery(
          subject
        )}.json?limit=5`
      );
      const responseJson = await response.json();
      booksSubjectsArray.push(responseJson.works);
    }

    const recommendedBooksArray = [];

    for (const recommendedBook of booksSubjectsArray.flat(1)) {
      const alreadyLikedRecommendedBooks = await LikedBook.findOne({
        userId: userId,
        bookUrl: recommendedBook.key,
      });
      if (
        !alreadyLikedRecommendedBooks &&
        !recommendedBooksArray.some((el) => el.key === recommendedBook.key)
      ) {
        recommendedBooksArray.push(recommendedBook);
      }
    }

    res.status(200).json({
      recommendedBooks: recommendedBooksArray,
      length: recommendedBooksArray.length,
      userId: userId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.get_liked_books_stats = async (req, res, next) => {
  try {
    const likedbooks = await LikedBook.find({ userId: req.userData.userId });

    const subjectsArray = [];

    likedbooks.forEach((element) => {
      if (Array.isArray(element.book.bookDetails.subjects))
        subjectsArray.push(...element.book.bookDetails.subjects);
    });

    const authorsArray = [];

    likedbooks.forEach((element) => {
      authorsArray.push(element.book.authorDetails.name);
    });

    res.status(200).json({
      topSubjects: findMostFrequent(subjectsArray),
      topAuthors: findMostFrequent(authorsArray),
      totalAmount: likedbooks.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

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
        book: req.body.book,
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
