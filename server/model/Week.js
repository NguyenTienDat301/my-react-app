const mongoose = require("mongoose");

const weekSchema = new mongoose.Schema({
  id: Number,
  date: String,
  title: String,
});

module.exports = mongoose.model("Week", weekSchema);