const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/register", async (req, res, next) => {
  try {
    const isEmailUsed = await User.find({email: req.body.email});

    if (isEmailUsed.length > 0) {
      return res.status(409).json({
        message: "Email is already in use",
      });
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
    });

    const result = await user.save();

    res.status(201).json({
      message: "User created",
      user: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err,
    });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.find({email: req.body.email});

    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }

    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      if (result) {
        const token = jwt.sign(
          {email: user[0].email, userId: user[0]._id},
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          message: "Auth successful",
          token: token,
        });
      }
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
    });
    console.error(e);
  }
});

router.delete("/delete/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const userRemoved = await User.deleteOne({_id: userId});

    if (userRemoved.deletedCount === 1) {
      res.status(200).json({
        message: "User deleted",
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (e) {
    res.status(500).json({
      error: e,
    });
    console.error(e);
  }
});

module.exports = router;
