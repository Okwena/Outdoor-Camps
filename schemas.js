const Joi = require('joi');

const {number} = require('joi')

module.exports.campgroundSchema = Joi.object({

    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        //image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()

    }).required(),//JOI authentification for new campgrounds
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),//Joi to ensure number is btn 1 & 5
        body: Joi.string().required()
    }).required()
})//Authentification to ensure an empty review isn't submitted
