// import the required libs
const mongoose = require('mongoose');

// create the database schema
var seedSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    seed: {
        type: String,
        required: true,
        unique: true,
        match: /[A-Z9]{81}/
    },
    twoFactorAuthSecret: {
        type: String,
        required: true
    },
    created_at: Date,
    updated_at: Date
});

// on every save, add the date
seedSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if(!this.created_at) this.created_at = currentDate;

    next();
});

// create a model for our schema
var Seed = mongoose.model('Seed', seedSchema);

// make this module available to our app
module.exports = Seed;