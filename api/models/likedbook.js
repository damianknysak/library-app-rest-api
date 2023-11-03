const mongoose = require("mongoose");

const likedBookSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  bookUrl: { type: String, required: true },
  userId: { type: String, required: true },
});

likedBookSchema.index({ bookUrl: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model("likedbook", likedBookSchema);
