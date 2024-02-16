const path = require("path");
const fs = require("fs");
const express = require("express");

id = express()

id.get('/', (req, res) => {
    console.log('test')
    const indexPath = path.join(__dirname,'..','..','public','index.html');
    const data = fs.readFileSync(indexPath, 'utf8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.end(data);
});
id.get('/auth', (req, res) => {
    console.log('test')
    id.use(express.static(path.join(__dirname,'..','..','public', 'registration')));

    const indexPath = path.join(__dirname,'..','..','public', 'registration','index.html');
    const data = fs.readFileSync(indexPath, 'utf8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.end(data);
});

module.exports = id;  // Экспортируем функцию passportID
