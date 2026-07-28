const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  id: Number,
  weekId: Number,
  unit: String,

  strong: [String],
  weak: [String],
});

module.exports = mongoose.model("Comment", commentSchema);