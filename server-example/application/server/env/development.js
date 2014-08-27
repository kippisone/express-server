var log = require('xqnode-logger');

module.exports = function(app, done) {
    'use strict';

	app.conf = require('../../../config/development.json');
	if (app.conf.loglevel) {
		log.sys(' ... setting loglevel:', app.conf.loglevel);
		log.setLevel(app.conf.loglevel);
	}

    this.port = app.conf.port;

    app.use(function(req, res, next){
        //Do something
        next();
    });

    done();
};
