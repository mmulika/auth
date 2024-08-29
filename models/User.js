const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  walletAddress: { type: String, required: true },
  privateKey: { type: String, required: true },
  mnemonicPhrase: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;