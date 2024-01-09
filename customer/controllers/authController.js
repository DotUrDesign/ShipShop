const bcrypt = require('bcrypt');
const pool = require('../db.js');
const emailValidator = require('email-validator');
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY;
const client = require("../redis/client.js");
require('dotenv').config();

// forgot password 
// reset password
// protectRoute

module.exports.register = async function register(req, res) {
    try {
        let {
            firstName,
            lastName,
            email,
            password,
            address
        } = req.body;
    
        let validateEmail = emailValidator.validate(email);
        if(!validateEmail){
            return res.status(403).json({
                message : "Enter valid email"
            })
        }
    
        if(password.length < 5 || password.length > 100){
            return res.status(403).json({
                message : "Password length should in between 5 and 50"
            })
        }
    
        let salt = await bcrypt.genSalt();
        let hashedPassword = await bcrypt.hash(password, salt);
        password = hashedPassword;
    
        let customerDetails = await pool.query(
            "insert into customer_table (firstName, lastName, email, password, address) values ($1, $2, $3, $4, $5) returning *",
            [firstName, lastName, email, password, address]
        );

        let cachedData = await client.get("All_customers_data");
        cachedData = JSON.parse(cachedData);
        if(cachedData == null)
            cachedData = [];
        cachedData.push(customerDetails.rows[0]);
        await client.set("All_customers_data", JSON.stringify(cachedData));
    
        if(customerDetails){
            return res.status(200).json({
                message : "Customer account created successfully",
                customerDetails: customerDetails.rows[0]
            })
        }
        else {
            return res.status(403).json({
                messsage: "Fill all the credentials carefully"
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.register_oauth_google = async function register_oauth_google(req, res) {
    
}

module.exports.register_oauth_github = async function register_oauth_github(req, res) {

}

function createAccessToken(payload){
    return jwt.sign(payload, JWT_KEY, {expiresIn : '55m'});
}

function createRefreshToken(payload){
    return jwt.sign(payload, JWT_KEY);
}

module.exports.login = async function login(req, res) {
    try {
        let {
            email,
            password
        } = req.body;
    
        let customer = await pool.query(
            "select * from customer_table where email = $1",
            [email]
        );

        if(customer)
        {
            let customerInfo = customer.rows[0];
            // bcrypt.compare(req.body.password, hashedPassword) -> follow the exact format.
            let isValid = await bcrypt.compare(password, customerInfo.password);
            if(isValid)
            {
                let refreshToken = createRefreshToken({id:customerInfo.customer_id, email:customerInfo.email});
                let accessToken = createAccessToken({id:customerInfo.customer_id, email:customerInfo.email});
    
                res.cookie('refreshToken', refreshToken, {httpOnly : true});
    
                await pool.query(
                    "update customer_table set isLoggedIn = $1 where email = $2",
                    [true, customerInfo.email]
                )
    
                return res.status(200).json({
                    message : "Verified, You are good to go!",
                    customerInfo: customerInfo,
                    accessToken: accessToken
                })
            } 
            else 
            {
                return res.status(403).json({
                    message : "Please enter correct credentials"
                })
            }
        }
        else
        {
            return res.status(403).json({
                message : "First register"
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.logout = async function logout(req, res){
    try {
        let cookie = req.cookies.refreshToken;
        if(cookie == null)
            return res.status(403).send("First login")
        let payload = await jwt.verify(cookie, JWT_KEY);
        let email = payload.email;

        res.cookie('refreshToken', ' ', {maxAge: 1});
        await pool.query(
            "update customer_table set isLoggedIn = $1 where email = $2",
            [false, email]
        );
        return res.status(200).json({
            message : "You are successfully logged out."
        })
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.protectRoute = async function protectRoute(req, res, next) {
    try {
        if(req.cookies.refreshToken)
        {
            let token = req.cookies.refreshToken;
            let payload = jwt.verify(token, JWT_KEY);
            if(payload)
            {
                // console.log(payload);
                req.id = payload.id;
                req.email = payload.email;
                next();
            }
            else
            {
                res.status(403).send("Wrong credentials");
            }
        }
        else 
        {
            res.status(403).send("First login");
        }
    } catch (error) {
        console.log(error.message);
    }
}