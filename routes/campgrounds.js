const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Err = require('../utils/Err');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../validate');

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

    console.log(`==========> requested path: ${ req.url }`);
});

router.get('/new', (req, res) => {
    res.render('campgrounds/new');

    console.log(`==========> requested path: ${ req.url }`);
});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${ campground._id }`);

    console.log(`==========> requested path: ${ req.url }`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });

    console.log(`==========> requested path: ${ req.url }`);
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });

    console.log(`==========> requested path: ${ req.url }`);
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${ campground._id }`);

    console.log(`==========> requested path: ${ req.url }`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

    console.log(`==========> requested path: ${ req.url }`);
}));

module.exports = router;
