'use strict';

// requirements
const errors = require('restify-errors');
const md5 = require('md5');
const twoFactor = require('node-2fa');
const config = require('../../../config/config');
const Seed = require('../../models/seed');
const QRCode = require('qrcode');

// create a seed
var create = function create(req, res, next) {
    // check if we have all necessary parameters
    if(typeof req.body.seed !== 'string') {
        return next(new errors.BadRequestError('missing or invalid seed parameter in request'));
    }

    // determine the unique identifier of the seed for future authentications
    var seedId = md5(config.seed_id_salt + req.body.seed);

    // check if the seed already exists
    Seed.findOne({id: seedId}, function(err, seed) {
        if(err) {
            console.error(err);

            return next(new InternalServerError('database error'));
        }

        // create a new seed if we didn't find a seed yet
        if(seed === null) {
            seed = new Seed({
                id: seedId,
                seed: req.body.seed
            });
        }

        // update the seed with a new two-factor-secret
        var twoFactorAuthDetails = twoFactor.generateSecret({name: 'MAIN WALLET'});
        seed.twoFactorAuthSecret = twoFactorAuthDetails.secret;

        // save the seed in the database
        seed.save(function(err) {
            if(err) {
                console.error(err);

                return next(new InternalServerError('database error'));
            }

            // generate the qrcode for the twofactor auth and send the response
            QRCode.toDataURL(decodeURIComponent(twoFactorAuthDetails.uri) + '&issuer=' + encodeURIComponent('IOTA Vault'), {
                errorCorrectionLevel: 'H',
                scale: 3,
                color: {
                    dark: '#FFFFFFFF',  // Blue dots
                    light: '#0000' // Transparent background
                }
            }).then((qrcode) => {
                res.send({
                    code: 'Ok',
                    data: {
                        id: seed.id,
                        twoFactorAuthSecret: twoFactorAuthDetails.secret,
                        qrcode: qrcode
                    }
                });

                return next(false);
            }, (err) => {
                console.error(err);

                return next(new InternalServerError('error generating qrcode'));
            });
        });

        // object of all the users
        console.log(seed);
    });
};

// retrieve a seed (for backup purposes - shouldn't be called for business logic)
var retrieve = function retrieve(req, res, next) {
    // return our result
    res.send({
        code: 'Ok',
        data: {
            id: req.seed.id,
            seed: req.seed.seed
        }
    });

    return next(false);
};

// make this module available to our app
module.exports = {
    create: create,
    retrieve: retrieve
};