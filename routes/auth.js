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
router.get('/wallet/id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const walletAccount = {
      walletAddress: user.walletAddress,
      privateKey: user.privateKey,
      mnemonicPhrase: user.mnemonicPhrase
    };
    console.log(walletAccount);
    res.status(200).send(walletAccount);
  } catch (error) {
    res.status(500).send('Server error');
  }
});
// Get account balance by user ID
router.get('/balance/id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const provider = new ethers.providers.AlchemyProvider('mainnet', 'YOUR_ALCHEMY_API_KEY');
    const balance = await provider.getBalance(user.walletAddress);
    const balanceInEther = ethers.utils.formatEther(balance);
    res.status(200).json({ balance: balanceInEther });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).send('Server error');
  }
});
module.exports = router;