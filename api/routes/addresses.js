const express = require('express');
require('dotenv').config();
const Shopify = require('shopify-api-node');
const router = express.Router();

const shopify = new Shopify({
    shopName: process.env.SHOP_NAME,
    apiKey: process.env.API_KEY,
    password: process.env.PASSWORD,
    maxRetries: 5
});

router.get('/:phoneNumber', async (req, res, next) => {
    try {
        const phoneNumber = req.params.phoneNumber;
        console.log(phoneNumber);
        const customers = await shopify.customer.list(phoneNumber);
        if (customers.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        const customerId = customers[0].id;

        const addresses = await shopify.customerAddress.list(customerId);
        const refinedaddresses = [];
        // console.log("+"+phoneNumber);
        for (let i = 0; i < addresses.length; i++) {
            // console.log(addresses[i].phone);
            if (addresses[i].phone == (phoneNumber) && addresses[i].phone != null){
                refinedaddresses.push(addresses[i]);
            }
        }
        res.json(refinedaddresses);
        // res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;