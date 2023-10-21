const User = require("../models/user");

exports.add_profile_image = async (req, res, next) => {
  try {
    const id = req.params.Id;
    const newProfileImage = req.file.path;

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
