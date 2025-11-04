const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  name: { type: String },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, default: 'Viewer' }
}, { timestamps: true });

UserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.statics.createWithPassword = async function(email, name, password, role='Viewer'){
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return this.create({ email, name, passwordHash: hash, role });
};

module.exports = mongoose.model('User', UserSchema);
