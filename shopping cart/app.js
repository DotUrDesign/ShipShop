const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());


app.listen(3002, () => {
    console.log("Server is running at port 3002");
})