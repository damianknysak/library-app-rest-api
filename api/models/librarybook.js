const mongoose = require("mongoose");

const librarybookSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  bookUrl: { type: String, required: true },
  userId: { type: String, required: true },
  book: { type: Object, required: true },
  isRead: { type: Boolean, required: true },
});

librarybookSchema.index({ bookUrl: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model("librarybook", librarybookSchema);
