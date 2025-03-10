const express = require('express');
const router = express.Router();
const Addaccount = require('../Models/Addaccount');
const getExchangeRate = require('../utils/getExchangeRate');

router.route('/').post(async (req, res) => {
    const { accountId, targetCurrency } = req.body;

    try {
        const account = await Addaccount.findById(accountId);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const exchangeRate = await getExchangeRate(account.acccurrency, targetCurrency);
        account.convertedValue = account.accvalue * exchangeRate;

        await account.save();
        res.json({ message: 'Currency converted successfully', account });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error converting currency', details: err.message });
    }
});

module.exports = router;
