var log = require('xqnode-logger'),
    basicAuth = require('connect-basic-auth');

module.exports = function(app, done) {
    'use strict';

	app.conf = require('../../../config/staging.json');
	if (app.conf.loglevel) {
        log.sys(' ... setting loglevel:', app.conf.loglevel);
		log.setLevel(app.conf.loglevel);
	}

    this.port = app.conf.port;

    app.use(basicAuth(function (user, password) {
        return user === "devteam" && password === "megasecret";
    }));

    done();
};
