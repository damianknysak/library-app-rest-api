const User = require("../models/user");
const fs = require("fs").promises;

exports.get_user = async (req, res, next) => {
  try {
    const id = req.params.Id;
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.add_profile_image = async (req, res, next) => {
  try {
    const id = req.userData.userId;
    const newProfileImage = req.file.path;

    // Check if a previous profile image exists
    const user = await User.findOne({ _id: id });
    if (
      user &&
      user.profileImage &&
      user.profileImage !== "images/default.png"
    ) {
      try {
        // If a previous profile image exists and is not the default one, delete it, BUT DOESNT RESPOND WITH ERROR
        await fs.unlink(user.profileImage);
      } catch (e) {
        console.error("Old image not found");
      }
    }

    const result = await User.updateOne(
      { _id: id },
      { $set: { profileImage: newProfileImage } }
    );

    if (result.nModified === 0) {
      res.status(404).json({
        message: `User not found`,
      });
    }

    res.status(200).json({
      message: `Image added`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.delete_user = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const userRemoved = await User.deleteOne({ _id: userId });

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
};
