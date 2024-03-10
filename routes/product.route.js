const express = require("express");
const {
    getProductList,
    CreateProduct
} =require('../controllers/product.controllers');
const jwtHandler =require('../utils/jwthandler');

// creating cusotm route;
const ProductRoute =express.Router();

ProductRoute.get('/getProductList',getProductList)
ProductRoute.post('/add',jwtHandler,CreateProduct)
module.exports =ProductRoute;