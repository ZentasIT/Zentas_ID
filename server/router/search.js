const { Router } = require('express');
const userController = require("../controllers/search");
const routerSearch = Router();
routerSearch.get('/mp', userController.search);
module.exports = routerSearch;
