module.exports = {
    // database to store the seed
    database: 'mongodb://127.0.0.1/iota_vault',

    // web server port the api should listen on
    web_server_port: 8080,

    // salt that is added to the seed to generate the unique md5 id of the seed
    seed_id_salt: 'mySecretSeedIdSalt%16BGF%'
};