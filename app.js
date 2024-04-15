const express = require('express');
const app = express();
const getaddresses = require('./api/routes/addresses');
const updateaddress = require('./api/routes/updateaddress');
const orderlist = require('./api/routes/getorderlist');
const customers = require('./api/routes/customers');
const order = require('./api/routes/getorder');
const orders = require('./api/routes/orders');
const cancelorder = require('./api/routes/cancelorder');
const bodyParser = require('body-parser');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/app/api/addresses', getaddresses);
app.use('/app/api/address/update', updateaddress);
app.use('/app/api/orders', orderlist);
// app.use('/customers', customers); // This route is not used in the app // was created just for debugging
app.use('/app/api/order', order);
// app.use('/orders', orders); // This route is not used in the app // was created just for debugging
app.use('/app/api/order/cancel', cancelorder);



app.use((req,res,next) => {
    res.status(404).json({
        message: 'bad request'
    })
});

module.exports = app;