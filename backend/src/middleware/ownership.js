const Post = require('../models/Post');
const { hasPermission } = require('./rbac');

// ownership('posts:update') -> checks full permission else 'posts:update:own' and authorId match
function ownership(actionBase) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    const role = req.user.role;
    if (hasPermission(role, actionBase)) return next();
    const ownAction = `${actionBase}:own`;
    if (!hasPermission(role, ownAction)) return res.status(403).json({ message: 'Forbidden' });

    const id = req.params.id;
    const post = await Post.findById(id).select('authorId');
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (post.authorId.equals(req.user.id)) return next();
    return res.status(403).json({ message: 'Forbidden - not owner' });
  };
}

module.exports = ownership;
