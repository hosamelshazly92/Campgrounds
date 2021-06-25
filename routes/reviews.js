const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateReview } = require('../utils/validateReview');
const { isLoggedIn } = require('../utils/isLoggedIn');
const { isReviewAuthor } = require('../utils/isReviewAuthor');
const reviews = require('../controllers/reviews');

router.post(
    '/',
    isLoggedIn,
    validateReview,
    catchAsync(reviews.createReview)
);

router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    catchAsync(reviews.deleteReviews)
);

module.exports = router;
