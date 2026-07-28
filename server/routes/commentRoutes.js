const express = require("express");
const router = express.Router();
const Comment = require("../model/Comment");

// GET
router.get("/", async (req, res) => {
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

// GET theo id
router.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.findOne({
      id: Number(req.params.id),
    });

    res.json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const comment = new Comment(req.body);

    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true }
    );

    res.json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Comment.findOneAndDelete({
      id: Number(req.params.id),
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;