const express = require('express');
const app = express();
const Shopify = require('shopify-api-node');
const url = require('url');

require('dotenv').config();

const shopify = new Shopify({
    shopName: process.env.SHOP_NAME,
    apiKey: process.env.API_KEY,
    password: process.env.PASSWORD,
});

app.get('/customers', async (req, res) => {
    const customers = await shopify.customer.list();
    res.json(customers);
});
app.get('/orders', async (req, res) => {
    const orders = await shopify.order.list();
    res.json(orders);
});


app.get('/app/api/addresses', async (req, res) => {
    try {
        const phoneNumber = req.query.phone_number;
        const customers = await shopify.customer.list({ phone: phoneNumber });
        
        
        if (customers.length === 0) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        const customerId = customers[0].id;

        const addresses = await shopify.customerAddress.list(customerId);
    
        res.json({ addresses });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.put('/app/api/address/update', async (req, res) => {
    try {
      const { address_id, address_data } = req.body;
      console.log(address_id);
      if (!address_id || !address_data) {
        return res.status(400).json({ error: 'Address ID and address data are required' });
      }
  
      const updatedAddress = await shopify.customerAddress.update(address_id, address_data);
  
      res.json({ message: 'Address updated successfully', updatedAddress });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/app/api/orders', async (req, res) => {
    try {
        const phoneNumber = req.query.phone_number;
        console.log(phoneNumber);
        const customers = await shopify.customer.list({ phone: phoneNumber });
        
        if (customers.length === 0) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        const customerId = customers[0].id;

        const orders = await shopify.order.list({ customer_id: customerId});
    
        res.json({ orders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/app/api/order', async (req, res) => {
    try {
      const orderNumber = req.query.order_number;
  
      const orders = await shopify.order.list({ order_number : orderNumber});

      const order = orders[0];
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json({ order });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/app/api/order/cancel/', async (req, res) => {
    try {
        const orderNumber = req.body.order_number || req.query.order_number;
        if (!orderNumber) {
            return res.status(400).json({ error: 'Order number is required' });
        }
        const cancellationResult = await shopify.order.cancel(orderNumber);
        if (!cancellationResult.success) {
            return res.status(404).json({ error: 'Order not found or already cancelled' });
        }
        res.json({ message: 'Order successfully cancelled' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  

app.listen(3000, () => console.log('Server running on port 3000'));



