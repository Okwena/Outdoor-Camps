const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true//If you have a validation middleware it won't be part of them 
    }
});

userSchema.plugin(passportLocalMongoose)//adds to our schema a username & password also makes sure those user names are unique and are not duplicated + aditional methods

module.exports = mongoose.model('User', userSchema)