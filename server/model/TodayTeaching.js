const mongoose = require("mongoose");

const TodayTeachingSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },

  teachingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teaching",
  },
});

module.exports = mongoose.model(
  "TodayTeaching",
  TodayTeachingSchema
);