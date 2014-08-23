var session = require('express-session');

module.exports = function(app, done) {
	'use strict';

    app.use(session({
        secret: 'My session secret',
        resave: true,
        saveUninitialized: true
    }));

	app.use(function(req, res, next){
		//Do something
		next();
	});

	done();
};