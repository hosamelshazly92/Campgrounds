const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Err = require('../utils/Err');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../validate');
const { isLoggedIn } = require('../utils/isLoggedIn');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(elm => elm.message).join(', ');
        throw new Err(msg, 400);
    } else {
        next();
    }
}

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'New campground was added successfully!');
    res.redirect(`/campgrounds/${ campground._id }`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Campground not found :(');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not found :(');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const campgroundName = await Campground.findById(id);
    req.flash('success', `${ campgroundName.title } was updated successfully!`);
    res.redirect(`/campgrounds/${ campground._id }`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground is removed');
    res.redirect('/campgrounds');
}));

module.exports = router;
