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
        const customers = await shopify.customer.list(phoneNumber);
        if (customers.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        const customerId = customers[0].id;

        const orders = await shopify.order.list(customerId);
        const refinedorders = [];
        // console.log("+"+phoneNumber);
        for (let i = 0; i < orders.length; i++) {
            // console.log(orders[i].phone);
            if (orders[i].phone == ("+"+phoneNumber) && orders[i].phone != null){
                refinedorders.push(orders[i]);
            }
        }
        res.json(refinedorders);
        // res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;