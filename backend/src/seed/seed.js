require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

async function run(){
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/rbacdb';
  await mongoose.connect(uri, { });
  console.log('Connected to', uri);

  await User.deleteMany({});
  await Post.deleteMany({});

  const admin = await User.createWithPassword('admin@example.com','Admin','AdminPass123','Admin');
  const editor = await User.createWithPassword('editor@example.com','Editor','EditorPass123','Editor');
  const viewer = await User.createWithPassword('viewer@example.com','Viewer','ViewerPass123','Viewer');

  await Post.create({ title: 'Admin Post', body: 'This is a post by admin', authorId: admin._id });
  await Post.create({ title: 'Editor Post', body: 'This is a post by editor', authorId: editor._id });
  console.log('Seed completed: admin/editor/viewer users created');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
