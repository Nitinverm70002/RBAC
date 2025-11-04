const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { signAccess, signRefresh, verifyRefresh } = require('../services/tokenService');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await user.verifyPassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const access = signAccess(user);
  const refresh = signRefresh(user);
  res.cookie('refreshToken', refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7*24*60*60*1000
  });
  res.json({ access, user: { id: user._id, email: user.email, role: user.role } });
});

// POST /auth/refresh
router.post('/refresh', async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });
  try {
    const payload = verifyRefresh(token);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    const access = signAccess(user);
    res.json({ access, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

module.exports = router;


