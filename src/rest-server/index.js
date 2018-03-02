'use strict';

// requirements
const restify = require('restify');
const restifyCorsMiddleware = require('restify-cors-middleware');
const twoFactorAuth = require('./middleware/twoFactorAuth')({maxDelta: 0});
const seedEndPoint = require('./endpoints/seed');
const digestEndPoint = require('./endpoints/digest');

// setup the server
var server = restify.createServer({
    name: 'iota-vault-api'
});

// configure our cors settings
const cors = restifyCorsMiddleware({
    origins: ['*'],
    allowHeaders: ['API-Token'],
    exposeHeaders: ['API-Token-Expiry']
});

// configure the server middleware
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.authorizationParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

// expose the endpoints
server.post('/seed',                            seedEndPoint.create);
server.get ('/seed',             twoFactorAuth, seedEndPoint.retrieve);
server.get ('/digest/:digestId', twoFactorAuth, digestEndPoint.retrieveOne);

// make this module available to our app
module.exports = server;