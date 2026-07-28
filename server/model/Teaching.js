const mongoose = require("mongoose");

const TeachingSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Teaching", TeachingSchema);