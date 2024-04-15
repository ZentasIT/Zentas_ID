const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path'); // Добавляем импорт модуля path
const usersFilePath = path.join(__dirname, '..', 'database', 'users', 'users.json');

class request{
    async request(req, res, next) {
        try {
            if (req.body && req.body.userName) {
                const token = req.body.userName;
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                if (!decodedToken.userId) return res.status(200).json({message: 'Неверный токен.'});

                let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
                const user = users.find(user => user.UserId === decodedToken.userId);
                if (!user) return res.status(200).json({message: 'Пользователь не найден.'})
                return res.json({daaa: user.firstName});

            }
            if (req.body && req.body.mainpage) {
                const token = req.body.mainpage;
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                if (!decodedToken.userId) {
                    return res.status(500).json({ message: 'Неверный токен.' });
                }
                let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
                const user = users.find(user => user.UserId === decodedToken.userId);
                if (!user || user.accessToken !== token) {
                    return res.status(500).json({ message: 'Неверный токен пользователя.' });
                }
                const resdata = {
                    name: user.firstName,
                    family: user.lastName,
                    surname: user.middleName,
                    number: user.phone,
                    id: user.DislayId,
                    date: user.Date
                };
                return res.json(resdata);
            }

            if (req.body && req.body.edit) {
                try {
                    const { name, surName, middleName, phone, date, userId } = req.body;
                    const decodedToken = jwt.verify(userId, process.env.JWT_SECRET);
                    if (!decodedToken) { return res.status(500).json({ message: 'Неверный токен.' }); }
                    let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
                    const user = users.find(user => user.UserId === decodedToken.userId);
                    if (!user || user.accessToken !== userId) return res.status(500).json({ message: 'Неверный токен пользователя.' });
                    user.firstName = name;
                    user.lastName = surName;
                    user.middleName = middleName;
                    user.phone = phone;
                    user.Date = date;
                    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4));
                    return res.status(200).json({ success: "Изменения приняты!" });
                } catch (error) {
                    next(error);
                }
            }
            // Перенаправление на страницу /api/refresh если отсутствует токен
            res.redirect('/api/refresh');
        } catch (error) {
            console.error('Ошибка:', error);
            return res.status(500).json({ message: 'Произошла ошибка при обработке запроса.' });
        }
    }
    async pro(req, res, next) {
        try {
            if (req.body && req.body.data) {
                const token = req.body.data;
                if (!token) return res.redirect('/api/refresh')
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                if (!decodedToken.userId) return res.status(500).json({message: 'Неверный токен.'});
                let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
                const user = users.find(user => user.UserId === decodedToken.userId);
                const filePro = path.join(__dirname, '..', 'database', 'pro', 'proUsers.json');
                let pros = JSON.parse(fs.readFileSync(filePro, 'utf8'))
                const prousr = pros.find(user => user.UserId === decodedToken.userId);
                if (!prousr) return res.status(400).json({message: 'error'})
                function getCurrentDate() {
                    const date = new Date();
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}.${month}.${year}`;
                }
                const currentDate = getCurrentDate();
                console.log(currentDate)
                if (currentDate >= prousr.ExpDate) {
                    console.log('Подписка истекла')
                    return res.status(400).json({ message: 'Подписка истекла' });
                } else {
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
        } catch (error) {
            // Обработка ошибки при отсутствии токена
            console.error('Ошибка:', error);
            return res.status(500).json({ message: 'Произошла ошибка при обработке запроса.' });
        }
    }
    async education(req, res, next) {
        try {
            if (req.body && req.body.reqdat) {
                const token = req.body.reqdat;
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                if (!decodedToken.userId) return res.status(500).json({ message: 'Неверный токен.' });
                let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
                const user = users.find(user => user.UserId === decodedToken.userId);
                const fileEdu = path.join(__dirname, '..', 'database', 'school', 'school.json');
                let pros = JSON.parse(fs.readFileSync(fileEdu, 'utf8'))
                const scusr = pros.find(user => user.UserId === decodedToken.userId);
                if (!scusr) return res.status(400).json({ message: 'error' })
                console.log("UserDetected!")
                const resData = {
                    schoolName: scusr.schoolName,
                    schoolAddress: scusr.schoolAddress,
                    schoolId: scusr.schoolId,
                }
                return res.status(200).json(resData);
            } else if (req.body && req.body.joinToSchool) {
                console.log('++')
                const token = req.body.joinToSchool;
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                if (!decodedToken.userId) return res.status(500).json({ message: 'Неверный токен.' });
                let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
                const user = users.find(user => user.UserId === decodedToken.userId);
                const fileEdu = path.join(__dirname, '..', 'database', 'school', 'school.json');
                let pros = JSON.parse(fs.readFileSync(fileEdu, 'utf8'))
                const scusr = pros.find(user => user.UserId === decodedToken.userId);
                if (!scusr) {
                    console.log('error')
                    const schoolBase = path.join(__dirname, '..', 'database', 'school', 'schoolBase.json');
                    let base = JSON.parse(fs.readFileSync(schoolBase, 'utf8'))
                    const search = base.find(base => base.schoolId === req.body.SchoolId);
                    if (!search) return res.status(400).json({ message: 'error' })
                    const addData = {
                        UserId: decodedToken.userId,
                        schoolId: search.schoolId,
                        schoolName: search.schoolName,
                        schoolAddress: search.schoolAddress,
                        schoolVerify: "false"
                    }
                    pros.push(addData);
                    fs.writeFileSync(fileEdu, JSON.stringify(pros, null, 4));

                    return res.status(200).json({ schoolName: search.schoolName });
                }
                if(user){
                    return res.status(500).json({message: "Пользователь уже привязан к ОУ"})
                }
                console.log("UserDetected!")
            } else if (req.body && req.body.getVerefyList){
                const fileEdu = path.join(__dirname, '..', 'database', 'school', 'school.json');
                let pros = JSON.parse(fs.readFileSync(fileEdu, 'utf8'))
            }
        } catch (err) {
            next(err)
        }
    }


}
module.exports = new request();