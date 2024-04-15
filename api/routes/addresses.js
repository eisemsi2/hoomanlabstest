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
        const customers = await shopify.customer.list();
        let k = -1;
        for (let i = 0; i < customers.length; i++) {
            if (customers[i].phone == phoneNumber) {
                k = i;
                break;
            }
        }
        if (k == -1) {
            res.json("No customer found with this phone number");
            return;
        }
        const customerId = customers[k].id;

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