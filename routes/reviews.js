const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Err = require('../utils/Err');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../validate');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(elm => elm.message).join(', ');
        throw new Err(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${ campground._id }`);

    console.log(`==========> requested path: ${ req.url }`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${ id }`);

    console.log(`==========> requested path: ${ req.url }`);
}));

module.exports = router;
