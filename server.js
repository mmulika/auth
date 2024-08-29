const express = require('express');
const mongoose = require('mongoose');
const { ethers }= require('ethers');
const authRoutes = require('./routes/auth');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/wallet', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});