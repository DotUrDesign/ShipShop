const express = require('express');
const bodyParser = require('body-parser');
const productRouter = require('./Routers/productRouter');

const app = express();
app.use(express.json());

app.use('/product', productRouter);

app.listen(3002, () => {
    console.log("Server is running at port 3002");
})