const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path'); // Добавляем импорт модуля path
const usersFilePath = path.join(__dirname, '..', 'database', 'users', 'users.json');
const crypto = require('crypto');

class pay{

    async payok(req, res, next) {
        const params = {
            amount: 100,
            payment: 10000,
            shop: 11151,
            currency: 'RUB',
            desc: 'Название товара',
            secret: '00c93da791a60d84300871205dadfa83' // Ваш секретный ключ
        };
        const array = [params.amount, params.payment, params.shop, params.currency, params.desc, params.secret];
        const sign = crypto.createHash('md5').update(array.join('|')).digest('hex');

        const paymentUrl = `https://payok.io/pay?amount=${params.amount}&payment=${params.payment}&desc=${params.desc}&shop=${params.shop}&currency=${params.currency}&sign=${sign}`;
        res.send(`<a href="${paymentUrl}">Купить</a>`);
    }

}
module.exports = new pay();