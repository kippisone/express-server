module.exports = function(app, done) {
	'use strict';

	app.get('/', function(req, res, next) {
		res.send('Hello World!');
	});

	done();
};