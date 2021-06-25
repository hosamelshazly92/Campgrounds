const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');

const passportAuthenticate = passport.authenticate(
    'local', 
    { 
        failureFlash: true,
        failureRedirect: '/login' 
    }
);

router.get(
    '/register',
    users.registerForm
);

router.post(
    '/register',
    catchAsync(users.registerUser)
);

router.get(
    '/login',
    users.loginForm
);

router.post(
    '/login',
    passportAuthenticate,
    users.loginUser
);

router.get(
    '/logout',
    users.logout
);

module.exports = router;
