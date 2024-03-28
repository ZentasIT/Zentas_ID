require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/index');
const routerPay = require('./router/pay');
const path = require("path");
const fs = require("fs");

const ID = require('./content/id-page');

const PORT = process.env.PORT;
const app = express();

// Middleware для перенаправления на HTTPS
const redirectToHTTPS = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
};


// Применяем middleware для всех запросов
app.use(redirectToHTTPS);

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://zentas.ru', // Разрешаем запросы с этого домена
    credentials: true // Разрешаем передачу учетных данных (например, куки)
}));
app.use('/api', router);
app.use('/pay', routerPay);
app.use(ID);
app.use(express.static(path.join(__dirname, '..', 'public')));

const start = async () => {
    try {
        if ("SOCKET" in process.env) {
            const socket = process.env.SOCKET;
            if (fs.existsSync(socket)) {
                fs.unlinkSync(socket);
            }
            app.listen(socket, () => {
                fs.chmodSync(socket, 0660);
                console.log(`Сервер запущен! Дата: ${new Date()}`);
                console.log(`Listening :${socket}`);
            });
        } else if ("PORT" in process.env) {
            app.listen(PORT, () => {
                console.log(`Сервер запущен! Дата: ${new Date()}`);
                console.log(`Listening http://${process.env.HOST}:${PORT}/`);
            });

        } else {
            app.listen(5001, () => {
                console.log(`Сервер запущен! Дата: ${new Date()}`);
                console.log('listening on *:5001');
            });
        }
    } catch (e) {
        console.log(e);
    }
};

start();
