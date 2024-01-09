const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const auth_customerRoute = require('./Routers/auth_customerRoute');
const customerRoute = require('./Routers/customerRoute.js');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth_customer', auth_customerRoute);

app.use('/customer', customerRoute);

app.listen(3001, () => {
    console.log("Server is running at port 3001");
})
