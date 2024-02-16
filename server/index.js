require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const  cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index')
const path = require("path");

const ID = require('./content/id-page')

const PORT = process.env.PORT
const app = express()

app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)
app.use(ID)
app.use(express.static(path.join(__dirname,'..','public')));



const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))
    }catch(e){
        console.log(e)
    }
}
start()