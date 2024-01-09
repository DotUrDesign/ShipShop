const express = require('express');
const productRouter = express.Router();
const { createProduct, getAllProducts, getProduct, similarProducts, updateProduct, deleteProduct } = require('../controllers/productController');


productRouter
.route('/createProduct')
.post(createProduct);

productRouter
.route('/getAllProducts')
.get(getAllProducts);

productRouter
.route('/getProduct/:id')
.get(getProduct);

productRouter
.route('/similarProducts/:id')
.get(similarProducts);

productRouter
.route('/updateProduct/:id')
.patch(updateProduct);

productRouter
.route('/deleteProduct/:id')
.delete(deleteProduct);

module.exports = productRouter;