const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  id: Number,
  weekId: Number,
  unit: String,

  quanSo: Number,
  hocTap: Number,
  tacPhong: Number,
  kyLuat: Number,
  noiVu: Number,
  tangGia: Number,
  vkTrangBi: Number,
});

module.exports = mongoose.model("Score", scoreSchema);