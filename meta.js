const axios = require('axios');

async function swapTokens(fromToken, toToken, amount) {
    try {
        const response = await axios.post('https://api.uniswap.org/v2/swap/exactTokensForTokens', {
            amountIn: amount,
            path: [fromToken, toToken],
            to: 'your_wallet_address',
            deadline: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes from now
        });

        console.log(response.data);
        // Handle the response data as per your requirements

    } catch (error) {
        if (error.response) {
            console.error('Error swapping tokens:', error.response.data);
            // Handle the error response as per your requirements
        } else {
            console.error('Error swapping tokens:', error.message);
            // Handle the error message as per your requirements
        }
    }
}

// Usage example
const fromToken = '0x1234567890'; // Address of the token you want to swap from
const toToken = '0xabcdef1234'; // Address of the token you want to swap to
const amount = 100; // Amount of tokens to swap

swapTokens(fromToken, toToken, amount);