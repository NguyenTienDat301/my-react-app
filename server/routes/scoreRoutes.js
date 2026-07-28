const express = require("express");
const router = express.Router();
const Score = require("../model/Score");

// GET
router.get("/", async (req, res) => {
  try {
    const { weekId } = req.query;

    if (weekId) {
      const scores = await Score.find({ weekId: Number(weekId) });
      return res.json(scores);
    }

    const scores = await Score.find();
    res.json(scores);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET theo id
router.get("/:id", async (req, res) => {
  try {
    const score = await Score.findOne({ id: Number(req.params.id) });
    res.json(score);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const score = new Score(req.body);
    await score.save();
    res.json(score);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const score = await Score.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true }
    );

    res.json(score);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Score.findOneAndDelete({ id: Number(req.params.id) });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;