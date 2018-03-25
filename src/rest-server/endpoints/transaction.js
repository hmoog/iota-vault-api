'use strict';

// requirements
const errors = require('restify-errors');
const IOTA = require('iota.lib.js');

// create our library instance
var iota = new IOTA();

// retrieve a signed transaction
var retrieveOne = function retrieve(req, res, next) {
    console.log(req.body.inputs);

    // return our result
    res.send({
        code: 'Ok',
        data: true/*{
            index: digestIndex,
            digest: iota.multisig.getDigest(req.seed.seed, digestIndex, 3)
        }*/
    });

    return next(false);
};

// make this module available to our app
module.exports = {
    retrieveOne: retrieveOne
};