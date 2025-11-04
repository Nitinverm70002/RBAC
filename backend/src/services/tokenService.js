const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'accesssecret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshsecret';

function signAccess(user) {
  return jwt.sign({ userId: user._id, role: user.role }, ACCESS_SECRET, { expiresIn: '15m' });
}
function signRefresh(user) {
  return jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: '7d' });
}
function verifyAccess(token) { return jwt.verify(token, ACCESS_SECRET); }
function verifyRefresh(token) { return jwt.verify(token, REFRESH_SECRET); }

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };
