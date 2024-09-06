const axios = require('axios');

async function getTopTokensAndCoins() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 10,
                page: 1,
            },
        });

        const topTokensAndCoins = response.data;
        console.log(topTokensAndCoins);
        // Process the data as per your requirements

    } catch (error) {
        console.error('Error fetching top tokens and coins:', error);
    }
}

getTopTokensAndCoins();