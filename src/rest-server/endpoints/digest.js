'use strict';

// requirements
const errors = require('restify-errors');
const IOTA = require('iota.lib.js');

// create our library instance
var iota = new IOTA();

// retrieve a seed (for backup purposes - shouldn't be called for business logic)
var retrieveOne = function retrieve(req, res, next) {
    var digestIndex = parseInt(req.params.digestId);

    digestIndex = isNaN(digestIndex) ? 0 : digestIndex;

    // return our result
    res.send({
        code: 'Ok',
        data: {
            index: digestIndex,
            digest: iota.multisig.getDigest(req.seed.seed, digestIndex, 3)
        }
    });

    return next(false);
};

// make this module available to our app
module.exports = {
    retrieveOne: retrieveOne
};