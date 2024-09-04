const Web3 = require('web3');

const web3 = new Web3('https://Sepolia.infura.io/v3/d2c350e755e742cda3a9a8d7084a8f01');

const createWallet = async () => {
    const wallet = await web3.eth.accounts.create();
    console.log('Wallet Address:', wallet.address);
    console.log('Private Key:', wallet.privateKey);
};

createWallet();

const getBalance = async (address) => {
    const balance = await web3.eth.getBalance(address);
    console.log('Balance:', balance);
};

getBalance('0x7800f931d57F537F15D8E566cF448e5A18cFA176');