const express = require("express");
const router = express.Router();

const User = require("../models/user");

const AuthController = require("../controllers/auth");
const UsersController = require("../controllers/users");

const checkAuth = require("../middleware/checkAuth");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(":", "-") + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/:Id", UsersController.get_user);

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post(
  "/addProfileImage",
  checkAuth,
  upload.single("image"),
  UsersController.add_profile_image
);

router.delete("/delete/:userId", UsersController.delete_user);

module.exports = router;
