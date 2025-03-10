const axios = require('axios');

async function getExchangeRate(baseCurrency, targetCurrency) {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    const rates = response.data.rates;
    return rates[targetCurrency];
}

module.exports = getExchangeRate;
