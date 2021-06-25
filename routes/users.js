const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

const passportAuthenticate = passport.authenticate(
    'local', 
    { 
        failureFlash: true,
        failureRedirect: '/login' 
    }
);

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Registered successfully!');
            res.redirect('/campgrounds');
        });
    } catch(err) {
        req.flash('error', 'Looks like username or email are already registered.');
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passportAuthenticate, (req, res) => {
    req.flash('success', `Welcome back, ${ req.user.username }!`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', `Goodbye.`);
    res.redirect('/campgrounds');
});

module.exports = router;
