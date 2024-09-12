const fetch = require('node-fetch');

async function listTopCurrencies() {
    const currencies = [
        { name: 'USD', code: 'usd' },
        { name: 'EUR', code: 'eur' },
        { name: 'JPY', code: 'jpy' },
        { name: 'GBP', code: 'gbp' },
        // Add more currencies here
    ];

    for (const currency of currencies) {
        const response = await fetch(`https://api.example.com/currencies/${currency.code}`);
        const data = await response.json();
        console.log(data);
        const marketValue = data.value;

        console.log(`${currency.name}: ${marketValue}`);
    }
}

listTopCurrencies();