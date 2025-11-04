const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: String,
  body: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

PostSchema.index({ authorId: 1, isDeleted: 1 });

module.exports = mongoose.model('Post', PostSchema);
