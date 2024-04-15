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

router.put('/:address_id', async (req, res, next) => {
    try {
        const address_id = req.params.address_id;
        const address_data = req.body;
        
        const customers = await shopify.customer.list();

        let k = -1;

        for (let i = 0; i < customers.length; i++) {
            const addresses = await shopify.customerAddress.list(customers[i].id);
            for (let j = 0; j < addresses.length; j++) {
                if (addresses[j].id == address_id) {
                    k = i;
                    break;
                }
            }
            if (k != -1) {
                break;
            }
        }

        if (k == -1) {
            return res.status(404).json({ error: 'Address not found' });
        }
        const customerid = customers[k].id;
        console.log(customerid);
        const update = await shopify.customerAddress.update(customerid, address_id, address_data);
        res.json(update);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;