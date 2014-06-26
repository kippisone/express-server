module.exports = function(app, done) {
	'use strict';

	app.use(function(req, res, next){
		//Do something
		next();
	});

	done();
};