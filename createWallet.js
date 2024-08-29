const  {ethers} = require ('ethers');


//fuction to create ethereum  wallet account


function createWallet (){
    //generate a random  wallet account

    const wallet = ethers.Wallet.createRandom();
    //dispaly wallet details

  console.log('Address:', wallet.address);
  console.log('Private Key:', wallet.privateKey);
  console.log('Mnemonic:', wallet.mnemonic.phrase);
}
createWallet();