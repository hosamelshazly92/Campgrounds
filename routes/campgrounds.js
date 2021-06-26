const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../utils/isLoggedIn');
const { isAuthor } = require('../utils/isAuthor');
const { validateCampground } = require('../utils/validateCampground');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get(
    '/',
    catchAsync(campgrounds.index)
);

router.get(
    '/new',
    isLoggedIn,
    campgrounds.newForm
);

router.post(
    '/',
    isLoggedIn,
    upload.array('image'),
    validateCampground,
    catchAsync(campgrounds.createCampground)
);

router.get(
    '/:id',
    catchAsync(campgrounds.showCampground)
);

router.get(
    '/:id/edit',
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.editForm)
);

router.put(
    '/:id',
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
);

router.delete(
    '/:id',
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
