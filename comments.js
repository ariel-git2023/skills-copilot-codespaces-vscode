// Create web server
// Create a new comment
// Get all comments
// Get comment by id
// Update comment
// Delete comment

// Import express
const express = require('express');
// Import model
const Comment = require('../models/Comment');
// Import router
const router = express.Router();

// Create a new comment
router.post('/comments', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all comments
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.send(comments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get comment by id
router.get('/comments/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }
    res.send(comment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update comment
router.patch('/comments/:id', async (req, res) => {
  const id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['comment', 'author'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }
  try {
    const comment = await Comment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!comment) {
      return res.status(404).send('Comment not found');
    }
    res.send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete comment
router.delete('/comments/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }
    res.send(comment);
  } catch (error) {
    res.status(500).