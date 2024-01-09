const express = require('express');
const { protectRoute } = require('../controllers/authController');
const { getCustomer, updateCustomer, deleteCustomer, getAllCustomers } = require('../controllers/customerController');
const app = express();
const customerRoute = express.Router();

customerRoute
.route('/getAllCustomers')
.get(getAllCustomers);

customerRoute.use(protectRoute)
customerRoute
.route('/getCustomer')
.get(getCustomer);

customerRoute
.route('/updateCustomer')
.patch(updateCustomer);

customerRoute
.route('/deleteCustomer')
.delete(deleteCustomer);


module.exports = customerRoute;
