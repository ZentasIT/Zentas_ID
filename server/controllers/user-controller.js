const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path'); // Добавляем импорт модуля path
const cookieParser = require('cookie-parser');
const express = require("express");
const router = require('../router/index.js');

require('dotenv').config();
function generateAccessToken(user) {
    return jwt.sign({ userId: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
}
function generateRefreshToken(user) {
    return jwt.sign({ userId: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

function generateUUID(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function generateNumUUID(length) {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const transporter = nodemailer.createTransport({
    host: 'smtp.zentas.ru',
    port: 25,
    secure: false,
    auth: {
        user: 'info@zentas.ru',
        pass: 'AAAlesha11223'
    },
    tls: {
        rejectUnauthorized: false
    }
});



class UserController {


    async registration(req, res, next) {
        try {
            const { name, family, otchestvo, rdate, number, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const activationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
            const newUser = { UserId: generateUUID(16), DislayId: generateNumUUID(8),firstName: name, lastName: family, middleName: otchestvo, Date: rdate, phone: number, email, password: hashedPassword, activationLink: activationToken, isActivated: false };
            const filePath = path.join(__dirname, '..', 'database', 'users', 'users.json');

            let users = [];
            try { users = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch (err) { console.log('Error reading or parsing file:', err); }

            if (!Array.isArray(users)) {
                users = []; // Если users не является массивом, инициализируем его пустым массивом
            }

            // Проверяем, есть ли уже пользователь с таким email
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                return res.status(200).json({ message: 'Пользователь с такой почтой существует' });
            }

            users.push(newUser);
            fs.writeFileSync(filePath, JSON.stringify(users, null, 4));

            const mailOptions = { from: '"Зентас ID" <info@zentas.ru>', to: email, subject: 'Подтвердите свой электронный адрес', html: `Ссылка на активацию: <a href="http://localhost:5000/activate/${activationToken}">http://localhost:5000/activate/${activationToken}</a>` };
            await transporter.sendMail(mailOptions);

            res.status(201).json({ success: 'Пользователь зарегистрирован успешно. Ссылка на активацию отправлена на почту' });
        } catch (error) { console.error("Error during registration:", error); next(error); }
    }




    async activate(req, res, next) {
        try {
            const activationToken = req.params.link;
            const filePath = path.join(__dirname, '..', 'database', 'users', 'users.json');

            let users = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            const user = users.find(user => user.activationLink === activationToken);
            if (!user) return res.status(400).json({ message: 'Invalid activation link.' });

            user.isActivated = true;

            fs.writeFileSync(filePath, JSON.stringify(users, null, 4));

            res.redirect('http://localhost:5000/auth#verify');
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password, user_email, user_code } = req.body;
            const filePath = path.join(__dirname, '..', 'database', 'users', 'users.json');
            let users = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            if (email && email !== "") {
                const user = users.find(user => user.email === email);
                if (!user) return res.status(200).json({ message: 'Пользователь не найден' });
                const authCode = Math.floor(100000 + Math.random() * 900000);
                const mailOptions = { from: '"Зентас ID" <info@zentas.ru>', to: email, subject: 'Код для авторизации', text: `${authCode}` };
                await transporter.sendMail(mailOptions);
                user.tempCode = authCode.toString();
                fs.writeFileSync(filePath, JSON.stringify(users, null, 4));
                return res.status(200).json({ success: 'Код отправлен на email' });
            } if (user_email && user_code) {
                const user = users.find(user => user.email === user_email);
                if (!user) return res.status(200).json({ message: 'Пользователь не найден' });
                if (user.tempCode !== user_code) return res.status(200).json({ message: 'Неверный код' });
                user.tempCode = null;
                const accessToken = generateAccessToken(user);
                const refreshToken = jwt.sign({ userId: user.UserId }, process.env.JWT_REFRESH_SECRET);
                user.refreshToken = refreshToken;
                user.accessToken = accessToken;
                fs.writeFileSync(filePath, JSON.stringify(users, null, 4));
                console.log("__")
                res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
                res.cookie('accessToken', accessToken, { maxAge: 900000 });
                // res.cookie('refreshToken', refreshToken, { domain: 'zentas.ru', httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
                // res.cookie('accessToken', accessToken, { domain: 'zentas.ru', maxAge: 900000 });
                console.log("--")
                return res.json({ success: 'Authentication successful' });
            } else {
                return res.status(200).json({ message: 'Invalid request.' });
            }
        } catch (error) {
            next(error);
        }
    }


    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            const filePath = path.join(__dirname, '..', 'database', 'users', 'users.json');
            let users = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Поиск пользователя по refreshToken
            const user = users.find(user => user.refreshToken === refreshToken);
            if (!user) {
                return res.redirect('/auth');
            }

            // Верификация refreshToken
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
                if (err) {
                    // Если refreshToken неверен, перенаправляем на страницу аутентификации и отправляем сообщение об ошибке
                    return res.status(400).json({ message: 'Invalid refresh token' });
                }

                // Генерация нового accessToken и refreshToken
                const accessToken = generateAccessToken(user);
                const newRefreshToken = jwt.sign({ userId: user.UserId }, process.env.JWT_REFRESH_SECRET);

                // Обновление данных пользователя и сохранение в файл
                user.refreshToken = newRefreshToken;
                user.accessToken = accessToken;
                fs.writeFileSync(filePath, JSON.stringify(users, null, 4));

                // Сохранение новых токенов в куки
                res.cookie('accessToken', accessToken, { httpOnly: false, maxAge: 900000 });
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
                // res.cookie('accessToken', accessToken, { domain: 'zentas.ru', httpOnly: false, maxAge: 900000 });
                // res.cookie('refreshToken', newRefreshToken, { domain: 'zentas.ru', httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });


                // Перенаправление на предыдущую страницу или на главную
                res.redirect(req.headers.referer || '/');
            });

        } catch (error) {
            // В случае ошибки перенаправляем на страницу аутентификации и передаем ошибку в следующий middleware
            res.redirect('/auth');
            next(error);
        }
    }






    async logout(req, res, next) {
        try {
            const { logout: accessToken } = req.body;
            const filePath = path.join(__dirname, '..', 'database', 'users', 'users.json');
            let users = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            const user = users.find(user => user.refreshToken === accessToken);
            if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

            user.refreshToken = undefined;
            fs.writeFileSync(filePath, JSON.stringify(users, null, 4));

            res.json({ message: 'Выход успешен' });

        } catch (error) {
            next(error);
        }
    }


    async getUsers(req, res, next) {
        try {
            let users = [];
            if (fs.existsSync(USERS_DB_PATH)) {
                users = JSON.parse(fs.readFileSync(USERS_DB_PATH));
            }
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async users(req, res, next) {
        try {
            // Пустой метод
        } catch (error) {
            next(error);
        }
    }



}

module.exports = new UserController();
