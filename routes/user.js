
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../model/user')
const passport = require('passport')
const isAuthenticated = require('../middleware/auth')

router.get('/', (req, res) => {
    res.render('home')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', (req, res) => {
    console.log(req.body)
    const { email, password, firstname, lastname } = req.body

    const hashPassword = bcrypt.hashSync(password)
    const newUser = new User({ email, password: hashPassword, firstname, lastname })
    newUser.save()
        .then(e => {
            res.redirect('/api/user/login')
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: "Ошибка при регистрации пользователя" })
        })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/api/user/me',
        failureRedirect: '/api/user/login'
    })(req, res, next);
})

router.get('/me', isAuthenticated, (req, res) => {
    res.render('me', {
        user: req.user
    })
})

router.get('/logout', isAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/api/user/login');
})

module.exports = router