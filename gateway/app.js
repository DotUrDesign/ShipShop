const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();

app.use(express.json());

app.use('/customer', proxy('http://localhost:3001'));
app.use('/products', proxy('http://localhost:3002'));
app.use('/shopping-cart', proxy('http://localhost:3003'));
app.use('/payment', proxy('http://localhost:3005'));
app.use('/support', proxy('http://localhost:3006'));

app.listen(3000, () => {
    console.log("Server  is running at port 3000");
})