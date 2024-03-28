const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path'); // Добавляем импорт модуля path
const cookieParser = require('cookie-parser');
const express = require("express");
const router = require('../router/index.js');

class request{
    async request(req, res, next) {
        try {
            if (req.body && req.body.userName) {
                const token = req.body.userName;
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                if (!decodedToken.userId) {
                    return res.status(200).json({message: 'Неверный токен.'});
                }

                const filePath = path.join(__dirname, '..', 'database', 'users', 'users.json');
                let users = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                const user = users.find(user => user.email === decodedToken.userId);
                if (!user) {
                    return res.status(200).json({message: 'Пользователь не найден.'});
                }
                res.json({ daaa: user.firstName });

            }
            if (req.body && req.body.mainpage){
                const token = req.body.mainpage;

                // Проверка на пустой токен или отсутствие токена

                console.log('+')
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                if (!decodedToken.userId) {
                    return res.status(500).json({message: 'Неверный токен.'});
                }

                const filePath = path.join(__dirname, '..', 'database', 'users', 'users.json');
                let users = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                const user = users.find(user => user.email === decodedToken.userId);

                if (!user || user.accessToken !== token) {
                    return res.status(500).json({message: 'Неверный токен пользователя.'});
                }

                const resdata = {
                    name: user.firstName,
                    family: user.lastName,
                    surname: user.middleName,
                    number: user.phone,
                    id: user.DislayId,
                    date: user.Date
                };

                console.log(resdata);
                res.json(resdata);
            }
            if (req.body.hasOwnProperty('edit')) {
                console.log(req.body);

                try {
                    const { name, surName, middleName, phone, date, userid } = req.body;
                    const decodedToken = jwt.verify(userid, process.env.JWT_SECRET);

                    if (!decodedToken) {
                        return res.status(500).json({ message: 'Неверный токен.' });
                    }

                    const filePath = path.join(__dirname, '..', 'database', 'users', 'users.json');
                    let users = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                    const user = users.find(user => user.email === decodedToken.userId);
                    if (!user || user.accessToken !== userid) {
                        return res.status(500).json({ message: 'Неверный токен пользователя.' });
                    }

                    user.firstName = name;
                    user.lastName = surName;
                    user.middleName = middleName;
                    user.phone = phone;
                    user.Date = date;

                    fs.writeFileSync(filePath, JSON.stringify(users, null, 4));

                    return res.status(200).json({ success: "Изменения приняты!" });
                } catch (error) {
                    console.error('Ошибка:', error);
                    return res.status(500).json({ message: 'Произошла ошибка при обработке запроса.' });
                }
            }

            if (req.body.hasOwnProperty('edu')) {
                console.log(req.body);

                try {
                    const { Class, School, userid } = req.body;
                    const decodedToken = jwt.verify(userid, process.env.JWT_SECRET);
                    if (!decodedToken) {
                        return res.status(500).json({ message: 'Неверный токен.' });
                    }
                    const usersFilePath = path.join(__dirname, '..', 'database', 'users', 'users.json');
                    const schoolFilePath = path.join(__dirname, '..', 'database', 'school', 'school.json');
                    let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
                    const user = users.find(user => user.email === decodedToken.userId);
                    const schoolData = {
                        userid: user.DislayId, // Используйте идентификатор пользователя, чтобы связать данные с пользователем
                        Class: Class,
                        School: School
                    };
                    let schoolDataArray = JSON.parse(fs.readFileSync(schoolFilePath, 'utf8'));
                    const existingUserIndex = schoolDataArray.findIndex(item => item.userid === user.UserId);
                    if (existingUserIndex !== -1) {
                        schoolDataArray[existingUserIndex] = schoolData;
                    } else {
                        schoolDataArray.push(schoolData);
                    }
                    fs.writeFileSync(schoolFilePath, JSON.stringify(schoolDataArray, null, 4));
                    return res.status(200).json({ success: "Изменения приняты!" });
                } catch (error) {
                    console.error('Ошибка:', error);
                    return res.status(500).json({ message: 'Произошла ошибка при обработке запроса.' });
                }
            }
            if (req.body.hasOwnProperty('edureq')) {
                console.log(req.body);

                try {
                    const { userid } = req.body;
                    const decodedToken = jwt.verify(userid, process.env.JWT_SECRET);
                    const usersFilePath = path.join(__dirname, '..', 'database', 'users', 'users.json');
                    const schoolFilePath = path.join(__dirname, '..', 'database', 'school', 'school.json');
                    let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
                    let school = JSON.parse(fs.readFileSync(schoolFilePath, 'utf8'));
                    const user = users.find(user => user.email === decodedToken.userId);
                    const existingUserIndex = school.find(existingUserIndex => existingUserIndex.userid === user.DislayId);

                    const schoolData = {
                        userid: user.DislayId, // Используйте идентификатор пользователя, чтобы связать данные с пользователем
                        Class: existingUserIndex.Class,
                        School: existingUserIndex.School
                    };
                    console.log(schoolData);
                    return res.status(200).json(schoolData);
                } catch (error) {
                    console.error('Ошибка:', error);
                    return res.status(500).json({ message: 'Произошла ошибка при обработке запроса.' });
                }
            }



            else {
                res.status(400).json({message: 'errir'})
            }

        } catch (error) {
            next(error);
        }
    }
    async education(req, res, next) {
        try {
            if (req.body.hasOwnProperty('educationList')) {
                const schoolDB = path.join(__dirname, '..', 'database', 'school', 'schoolBase.json');
                const sdb = JSON.parse(fs.readFileSync(schoolDB, 'utf8'))
                const names = sdb.map(obj => obj.schoolName);
                console.log(names)
                res.json(names);

            }
            if (req.body.hasOwnProperty('addEdu')) {
                function generateSchoolId() {
                    // Генерация 6-значного случайного числа
                    const code = Math.floor(100000 + Math.random() * 900000);
                    return code.toString();
                }

                const { schoolState, schoolName, schoolAddress } = req.body;
                const schoolDB = path.join(__dirname, '..', 'database', 'school', 'schoolBase.json');

                // Чтение существующего файла
                let sdb = [];
                try {
                    sdb = JSON.parse(fs.readFileSync(schoolDB, 'utf8'));
                } catch (error) {
                    console.error('Ошибка чтения файла:', error);
                }

                // Создание нового объекта
                const obj = {
                    schoolId: generateSchoolId(),
                    schoolState: schoolState,
                    schoolName: schoolName,
                    schoolAddress: schoolAddress
                }

                // Добавление нового объекта в массив
                sdb.push(obj);

                // Запись обновленного массива в файл
                fs.writeFile(schoolDB, JSON.stringify(sdb, null, 2), err => {
                    if (err) {
                        console.error('Ошибка записи в файл:', err);
                        return;
                    }
                    console.log('Объект успешно записан в файл.');
                });

                res.status(200).json(obj);
            }

        }
        catch (error) {
            next(error);
        }
    }
    async pro(req, res, next) {
        try {
            if (req.body && req.body.data){
                const token = req.body.data;

                // Проверка на пустой токен или отсутствие токена

                console.log('+')
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                if (!decodedToken.userId) {
                    return res.status(500).json({message: 'Неверный токен.'});
                }

                const filePath = path.join(__dirname, '..', 'database', 'users', 'users.json');
                let users = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                const user = users.find(user => user.UserId === decodedToken.userId2);

                // if (!user || user.accessToken !== token) {
                //     return res.status(500).json({message: 'Неверный токен пользователя.'});
                // }
                const filePro = path.join(__dirname, '..', 'database', 'pro', 'proUsers.json');
                let pros = JSON.parse(fs.readFileSync(filePro, 'utf8'))
                const prousr = pros.find(user => user.UserId === decodedToken.userId);
                console.log("userid", prousr)

                const resdata = {
                    exp: prousr.ExpDate,
                    count: prousr.count,
                    expCount: prousr.expCount,
                    quests: prousr.quests,

                };

                console.log(resdata);
                res.json(resdata);
            }
        }
        catch (error){
            next(error);

        }
    }
}
module.exports = new request();