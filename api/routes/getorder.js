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

router.get('/:orderNumber', async (req, res, next) => {
    try {
        const orderNumber = req.params.orderNumber;
        const orders = await shopify.order.list();

        let k = -1;
        for (let i = 0; i < orders.length; i++) {
            if (orders[i].order_number == orderNumber) {
                k = i;
                break;
            }
        }
        if (k == -1) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const order = orders[k];
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;