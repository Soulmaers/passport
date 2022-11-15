const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const userRouters = require('./routes/user')
const session = require('express-session')
const bodyParser = require('body-parser')




const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.use('/api/user', userRouters)
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: 'SECRET'
}));

require('./middleware/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 3000


async function start() {
    try {
        await mongoose.connect('mongodb://localhost:27017/us')
        app.listen(port, () => {
            console.log(`Сервер запущен порт:${port}`);
        })
    }

    catch (e) {
        console.log(e)
    }
}
start();



