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

router.get('/', async (req, res, next) => {
    try {
        const customers = await shopify.customer.list();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;