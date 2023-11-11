const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/checkAuth");
const LibraryBooksController = require("../controllers/librarybooks");

router.get("", checkAuth, LibraryBooksController.get_books_from_library);

router.get("/stats", checkAuth, LibraryBooksController.get_library_books_stats);

router.post("/update", checkAuth, LibraryBooksController.update_library_book);

router.post("/add", checkAuth, LibraryBooksController.add_book_to_library);

router.post(
  "/remove",
  checkAuth,
  LibraryBooksController.remove_book_from_library
);

router.post("/check", checkAuth, LibraryBooksController.check_book_in_library);

module.exports = router;
