const { Router } = require('express');
const userController = require("../controllers/pay");
const routerPay = Router();
routerPay.get('/payok', userController.payok);

module.exports = routerPay;
