const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: {type: String, required: true},
  price: {type: Number, required: true},
});

module.exports = mongoose.model("Book", bookSchema);
