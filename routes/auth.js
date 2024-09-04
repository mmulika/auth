const express = require('express');
const bcrypt = require('bcrypt');
const { ethers } = require('ethers');
const Web3 = require('web3');
const dotenv = require('dotenv');
const User = require('../models/User');
const router = express.Router();

dotenv.config();

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
  console.log(user);
  res.status(201).send(user);
});

// Get account balance by user ID
router.get('/balance/id/:id', async (req, res) => {
  const web3 = new Web3(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const balance = await web3.eth.getBalance(user.walletAddress);
    const balanceInEther = web3.utils.fromWei(balance, 'ether');
    console.log(balanceInEther);
    res.status(200).json({ balance: balanceInEther });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).send('Server error');
  }
});






// Transfer funds from one user to another
router.post('/transfer', async (req, res) => {
  const { senderId, receiverId, amount } = req.body;
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(404).send('User not found');
    }
    const web3 = new Web3(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
    const senderBalance = await web3.eth.getBalance(sender.walletAddress);
    const senderBalanceInEther = web3.utils.fromWei(senderBalance, 'ether');
    if (parseFloat(senderBalanceInEther) < amount) {
      return res.status(400).send('Insufficient balance');
    }
    const transaction = await web3.eth.sendTransaction({
      from: sender.walletAddress,
      to: receiver.walletAddress,
      value: web3.utils.toWei(amount.toString(), 'ether')
    });
    console.log(transaction);
    res.status(200).send('Transfer successful');
  } catch (error) {
    console.error('Error transferring funds:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;