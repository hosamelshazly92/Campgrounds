const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Err = require('../utils/Err');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../utils/validate');
const { validateReview } = require('../utils/validateReview');

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review was added successfully!');
    res.redirect(`/campgrounds/${ campground._id }`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review is removed');
    res.redirect(`/campgrounds/${ id }`);
}));

module.exports = router;
