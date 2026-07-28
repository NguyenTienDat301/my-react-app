const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const Week = require("./model/Week");
const Score = require("./model/Score");
const Comment = require("./model/Comment");

const data = JSON.parse(fs.readFileSync("./db.json", "utf8"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // Xóa dữ liệu cũ
    await Week.deleteMany({});
    await Score.deleteMany({});
    await Comment.deleteMany({});

    console.log("🗑 Đã xóa dữ liệu cũ");

    // ================== WEEKS ==================

    const weekIdMap = {};
    let weekId = 1;

    const weeks = data.weeks.map((item) => {
      weekIdMap[item.id] = weekId;

      return {
        id: weekId++,
        date: item.date,
        title: item.title,
      };
    });

    await Week.insertMany(weeks);

    console.log(`✅ Import ${weeks.length} weeks`);

    // ================== SCORES ==================

    let scoreId = 1;

    const scores = data.scores.map((item) => ({
      id: scoreId++,
      weekId: weekIdMap[item.weekId],
      unit: item.unit,
      quanSo: item.quanSo,
      hocTap: item.hocTap,
      tacPhong: item.tacPhong,
      kyLuat: item.kyLuat,
      noiVu: item.noiVu,
      tangGia: item.tangGia,
      vkTrangBi: item.vkTrangBi,
    }));

    await Score.insertMany(scores);

    console.log(`✅ Import ${scores.length} scores`);

    // ================== COMMENTS ==================

    let commentId = 1;

    const comments = data.comments.map((item) => ({
      id: commentId++,
      weekId: weekIdMap[item.weekId],
      unit: item.unit,
      strong: item.strong,
      weak: item.weak,
    }));

    await Comment.insertMany(comments);

    console.log(`✅ Import ${comments.length} comments`);

    console.log("🎉 Import thành công!");

    process.exit();
  })
  .catch((err) => {
    console.log(err);
  });