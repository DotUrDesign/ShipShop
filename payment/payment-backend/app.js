const express = require('express');
require('dotenv').config();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(STRIPE_SECRET_KEY);
const cors = require('cors');
const uuid = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("LET'S  IMPLEMENT STRIPE PAYMENT GATEWAY");
});

app.post('/make-payment', (req, res) => {
    const {product, token} = req.body;
    console.log("PRODUCT ", product);
    console.log("PRICE ", product.price);
    const idempotencyKey = uuid();  // When the customer refreshes its page or there is a network connection problem, this key ensures that the customer doesn't pay twice.
    
    return stripe.customers.create({
        // stripe creates a customer
        email : token.email,
        source : token.id
    }).then(customer => {
        stripe.charges.create({
            // stripe creates a charge for the customer 
            amount : product.price * 100,
            currency : 'usd',
            customer : customer.id,
            receipt_email : token.email,
            description : `purchase of ${product.name}`,
            shipping : {
                name : token.card.name,
                address : {
                    country : token.card.address_country
                }
            }
        } , {idempotencyKey})
    }).then(result => res.status(200).json(result))
    .catch(err => console.log(err))
})

app.listen(3005, () => {
    console.log("Server is running at port 3005")
});