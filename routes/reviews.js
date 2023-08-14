const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utilities/catchAsync.js')
const expressError = require('../utilities/expressError.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')

//const {reviewSchema} = require('../schemas.js')// JOI schema

const Review = require('../models/review')
const Campground = require('../models/campground.js');

const reviews = require('../controllers/reviews.js')



router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview))


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;