const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { renderLogin, renderRegister, renderDashboard, register, login, logout, activateUser } = require('../controllers/users');
const { isLoggedIn } = require('../middleware');

router.route('/')
    .get(renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/' }), login)


router.route('/register')
    .get(renderRegister)
    .post(catchAsync(register))

router.get('/approve-user', catchAsync(activateUser))

router.get('/logout', logout)

router.get('/dashboard', isLoggedIn , renderDashboard)

module.exports = router;