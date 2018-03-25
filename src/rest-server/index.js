'use strict';

// requirements
const restify = require('restify');
const restifyCorsMiddleware = require('restify-cors-middleware');
const twoFactorAuth = require('./middleware/twoFactorAuth')({maxDelta: 0});
const seedEndPoint = require('./endpoints/seed');
const digestEndPoint = require('./endpoints/digest');
const transactionEndpoint = require('./endpoints/transaction');

// setup the server
var server = restify.createServer({
    name: 'iota-vault-api'
});

// configure our cors settings
const cors = restifyCorsMiddleware({
    origins: ['*'],
    allowHeaders: ['Authorization']
});

// configure the server middleware
server.pre(cors.preflight);
server.use(cors.actual);
server.use((req, res, next) => {
    try {
        restify.plugins.authorizationParser()(req, res, next)
    } catch(error) {
        next();
    }
});
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

// expose the endpoints
server.post('/seed',                            seedEndPoint.create);
server.get ('/seed',             twoFactorAuth, seedEndPoint.retrieve);
server.get ('/digest/:digestId', twoFactorAuth, digestEndPoint.retrieveOne);
server.post('/transaction',      twoFactorAuth, transactionEndpoint.retrieveOne);

// make this module available to our app
module.exports = server;