'use strict';

// requirements
const errors = require('restify-errors');
const IOTA = require('iota.lib.js');

// create our library instance
var iota = new IOTA();

// retrieve a signed transaction
var retrieveOne = function retrieve(req, res, next) {
    var rawBundle = req.body.bundle;
    var inputs = req.body.inputs;

    console.log(req.body);
    for(const x in req.body) {
        console.log(x);
    }

    let signPromise = Promise.resolve(req.body.bundle);

    inputs.forEach((input) => {
        signPromise = signPromise.then((rawBundle) => {
            return new Promise((resolve, reject) => {
                iota.multisig.addSignature(rawBundle, input.address, iota.multisig.getKey(req.seed.seed, input.index, 3), (err, signedBundle) => {
                    if(err) return reject(err);

                    resolve(signedBundle);
                });
            });
        });
    });

    signPromise.then((signedBundle) => {
        res.send({
            code: 'Ok',
            data: signedBundle
        });

        return next(false);
    }, (err) => next(err));
};

// make this module available to our app
module.exports = {
    retrieveOne: retrieveOne
};