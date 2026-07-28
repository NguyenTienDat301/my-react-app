const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Week = require("./model/Week");
const Score = require("./model/Score");
const Comment = require("./model/Comment");
const Teaching = require("./model/Teaching");
const TodayTeaching = require("./model/TodayTeaching");
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running...");
});
//Week
app.get("/weeks", async (req, res) => {
  const weeks = await Week.find().sort({ id: 1 });
  res.json(weeks);
});
app.post("/weeks", async (req, res) => {
  const week = await Week.create(req.body);
  res.json(week);
});
//Score
app.get("/scores", async (req, res) => {
  const { weekId } = req.query;

  if (weekId) {
    const scores = await Score.find({ weekId: Number(weekId) });
    return res.json(scores);
  }

  const scores = await Score.find();
  res.json(scores);
});
app.get("/scores/:id", async (req, res) => {
  const score = await Score.findOne({ id: Number(req.params.id) });

  if (!score) {
    return res.status(404).json({ message: "Không tìm thấy" });
  }

  res.json(score);
});
app.post("/scores", async (req, res) => {
  const score = await Score.create(req.body);
  res.json(score);
});
app.put("/scores/:id", async (req, res) => {
  const score = await Score.findOneAndUpdate(
    { id: Number(req.params.id) },
    req.body,
    { new: true },
  );

  res.json(score);
});
app.delete("/scores/:id", async (req, res) => {
  await Score.findOneAndDelete({
    id: Number(req.params.id),
  });

  res.json({
    message: "Đã xóa",
  });
});
// Lấy comments
app.get("/comments", async (req, res) => {
  try {
    const { weekId, unit } = req.query;

    if (weekId && unit) {
      const comments = await Comment.find({
        weekId: Number(weekId),
        unit,
      });

      return res.json(comments);
    }

    if (weekId) {
      const comments = await Comment.find({
        weekId: Number(weekId),
      });

      return res.json(comments);
    }

    const comments = await Comment.find();

    res.json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Lấy comment theo id
app.get("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findOne({
      id: Number(req.params.id),
    });

    res.json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Thêm comment
app.post("/comments", async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Sửa comment
app.put("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true },
    );

    res.json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Xóa comment
app.delete("/comments/:id", async (req, res) => {
  try {
    await Comment.findOneAndDelete({
      id: Number(req.params.id),
    });

    res.json({
      message: "Đã xóa",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
app.get("/teaching/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Kiểm tra hôm nay đã có chưa
    let todayTeaching = await TodayTeaching.findOne({
      date: today,
    });

    if (!todayTeaching) {
      // Lấy toàn bộ lời dạy
      const teachings = await Teaching.find();

      if (teachings.length === 0) {
        return res.status(404).json({
          message: "Chưa có dữ liệu lời dạy",
        });
      }

      // Random
      const random = teachings[Math.floor(Math.random() * teachings.length)];

      // Lưu vào Mongo
      todayTeaching = await TodayTeaching.create({
        date: today,
        teachingId: random._id,
      });
    }

    const result = await TodayTeaching.findById(todayTeaching._id).populate(
      "teachingId",
    );

    res.json(result.teachingId);
  } catch (err) {
    res.status(500).json(err);
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
