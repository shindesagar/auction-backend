    const express = require("express");
    const {
        MakePayment
    } =require('../controllers/payment.controller');

    // creating cusotm route;
    const PaymentRoute =express.Router();

    PaymentRoute.post('/place-order-session',MakePayment)
    module.exports =PaymentRoute;