module.exports = function(app, done) {
	'use strict';

	app.get('/', function(req, res, next) {
		res.render('index');
	});

	done();
};