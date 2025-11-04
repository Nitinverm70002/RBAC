const permissionsConfig = require('../config/permissions');

function hasPermission(role, action) {
  const perms = permissionsConfig[role] || [];
  return perms.includes(action);
}

function can(action) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    const { role } = req.user;
    if (hasPermission(role, action)) return next();
    // allow 'own' check to be done by ownership middleware if needed
    return res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = { can, hasPermission };
