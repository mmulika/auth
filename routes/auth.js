const express = require('express');
const bcrypt = require('bcrypt');
const { ethers } = require('ethers');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const wallet = ethers.Wallet.createRandom();
  const details = {
    walletAddress: wallet.address,
    privateKey: wallet.privateKey,
    mnemonicPhrase: wallet.mnemonic.phrase
  };
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    password: hashedPassword,
    walletAddress: details.walletAddress,
    privateKey: details.privateKey,
    mnemonicPhrase: details.mnemonicPhrase
  });
  await user.save();
  console.log(details);
  console.log(user);
  res.status(201).send(user);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).send('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send('Invalid password');
    }
    res.status(200).send('Login successful');
});


// get user wallet account
router.get('/wallet', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).send('User not found');
    }
    const walletAccount = {
        walletAddress: user.walletAddress,
        privateKey: user.privateKey,
        mnemonicPhrase: user.mnemonicPhrase
    };
    res.status(200).send(walletAccount);
});
module.exports = router;