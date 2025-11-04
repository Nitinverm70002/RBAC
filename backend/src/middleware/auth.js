const { verifyAccess } = require('../services/tokenService');
const User = require('../models/User');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing authorization' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccess(token);
    req.user = { id: payload.userId, role: payload.role };
    req.userDoc = await User.findById(payload.userId).select('-passwordHash');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticate;
