const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { can } = require('../middleware/rbac');
const User = require('../models/User');

// GET /admin/users
router.get('/users', authenticate, can('users:manage'), async (req, res) => {
  const users = await User.find().select('-passwordHash').lean();
  res.json(users);
});

// PUT /admin/users/:id/role
router.put('/users/:id/role', authenticate, can('users:manage'), async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  // optional: write to audit log (omitted for brevity)
  res.json({ message: 'OK' });
});

module.exports = router;
