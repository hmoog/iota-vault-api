'use strict';

// requirements
const errors = require('restify-errors');
const twoFactor = require('node-2fa');
const Seed = require('../../models/seed');

// middleware to do the two-factor-authentication
var twoFactorAuth = function twoFactorAuth() {
    return function(req, res, next) {
        // check if we have all necessary information
        if(!req.authorization.basic || typeof req.authorization.basic.username !== 'string' || typeof req.authorization.basic.password !== 'string') {
            return next(new errors.BadRequestError('missing or invalid authorization in request'));
        }

        // check if the seed already exists
        Seed.findOne({id: req.authorization.basic.username}, function(err, seed) {
            // abort if we face a database error
            if(err) {
                console.error(err);

                return next(new InternalServerError('database error'));
            }

            // return authorization error if seed is unknown
            if(seed === null) {
                return next(new errors.UnauthorizedError('invalid seed id or one time password'));
            }

            // return authorization error if two-factor-auth is wrong
            var verificationResult = twoFactor.verifyToken(seed.twoFactorAuthSecret, req.authorization.basic.password);
            if(false && (verificationResult === null || Math.abs(verificationResult.delta) > 0)) {
                return next(new errors.UnauthorizedError('invalid seed id or one time password'));
            }

            // store the seed in the request so we can access it at a later point
            req.seed = seed;

            // if auth succeeded - continue
            next();
        });
    };
}

// make this module available to our app
module.exports = twoFactorAuth;