const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { can } = require('../middleware/rbac');
const ownership = require('../middleware/ownership');
const Post = require('../models/Post');

// GET /posts  (public to authenticated who have posts:read)
router.get('/', authenticate, can('posts:read'), async (req, res) => {
  const posts = await Post.find({ isDeleted: false }).limit(100).lean();
  res.json(posts);
});

// GET /posts/:id
router.get('/:id', authenticate, can('posts:read'), async (req, res) => {
  const p = await Post.findById(req.params.id);
  if (!p || p.isDeleted) return res.status(404).end();
  res.json(p);
});

// POST /posts
router.post('/', authenticate, can('posts:create'), async (req, res) => {
  const post = await Post.create({ ...req.body, authorId: req.user.id });
  res.status(201).json(post);
});

// PUT /posts/:id  (ownership-aware)
router.put('/:id', authenticate, ownership('posts:update'), async (req, res) => {
  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE /posts/:id (ownership-aware; soft delete)
router.delete('/:id', authenticate, ownership('posts:delete'), async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.status(204).end();
});

module.exports = router;
