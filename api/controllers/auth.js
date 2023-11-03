const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.login = async (req, res, next) => {
  try {
    const user = await User.find({ email: req.body.email });

    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        message: "Missing arguments",
      });
    }
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }

    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed password compare",
        });
      }
      if (result) {
        const token = jwt.sign(
          { email: user[0].email, userId: user[0]._id },
          process.env.JWT_KEY,
          {
            expiresIn: "365d",
          }
        );
        const userResponse = { ...user[0]._doc };
        delete userResponse.password;

        return res.status(200).json({
          message: "Auth successful",
          user: userResponse,
          token: token,
        });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: e,
    });
  }
};

exports.register = async (req, res, next) => {
  try {
    const isEmailUsed = await User.find({ email: req.body.email });

    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.firstName ||
      !req.body.lastName
    ) {
      return res.status(400).json({
        message: "Missing arguments",
      });
    }

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

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    const result = await user.save();
    const userResponse = { ...result._doc };
    delete userResponse.password;

    res.status(201).json({
      message: "User created",
      user: userResponse,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err,
    });
  }
};
