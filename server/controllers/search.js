const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path'); // Добавляем импорт модуля path
const usersFilePath = path.join(__dirname, '..', 'database', 'users', 'users.json');

class search{
    async search(req, res, next) {
        try{
            const queryParam = req.query.search;
            console.log(queryParam);
            const fileSearch = path.join(__dirname, '..', 'database', 'searchSystem', 'searchDb.json');
            let search = JSON.parse(fs.readFileSync(fileSearch, 'utf8'));

            const foundObjects = search.filter(item => item.tags.includes(queryParam));

            // Если объект не найден, отправить ошибку
            if (foundObjects.length === 0) {
                return res.status(400).json({ message: 'Object not found' });
            }

            // Чтение HTML файла
            const indexPath = path.join(__dirname, '..', '..', 'public', 'search.html');
            let htmlContent = fs.readFileSync(indexPath, 'utf8');

            // Замена метки {{foundObjects}} на JSON данные
            htmlContent = htmlContent.replace('{{foundObjects}}', JSON.stringify(foundObjects));

            // Установка заголовка ответа, чтобы указать, что это HTML содержимое
            res.setHeader('Content-Type', 'text/html');

            // Отправка HTML страницы с JSON данными
            res.send(htmlContent);


        } catch (error){
            next(error);
        }
    }
}
module.exports = new search();