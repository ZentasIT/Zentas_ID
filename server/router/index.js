// index.js

const { Router } = require('express');
const userController = require('../controllers/user-controller');
const request = require('../controllers/request');
const passportID = require('../content/id-page'); // Правильно импортируем passportID
const router = Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/request', request.request);
router.post('/edu', request.education);
router.get('/activate/:link', userController.activate); // здесь исправлено
router.get('/refresh', userController.refresh);
router.get('/users', userController.getUsers);

module.exports = router;
