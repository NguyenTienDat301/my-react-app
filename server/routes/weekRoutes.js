const express = require("express");
const router = express.Router();
const Week = require("../model/Week");

// GET tất cả
router.get("/", async (req, res) => {
  try {
    const weeks = await Week.find().sort({ id: 1 });
    res.json(weeks);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET theo id
router.get("/:id", async (req, res) => {
  try {
    const week = await Week.findOne({ id: Number(req.params.id) });
    res.json(week);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const week = new Week(req.body);
    await week.save();
    res.json(week);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const week = await Week.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true }
    );

    res.json(week);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Week.findOneAndDelete({ id: Number(req.params.id) });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;