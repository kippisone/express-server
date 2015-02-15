module.exports = function(app, done) {
	'use strict';
	
	var file = require('fs').readFile,
		path = require('path');

	var handlebars = require('handlebars');

	app.get(this.apiRoute, function(req, res) {
		file(path.join(__dirname, '../views/api.hbs'), { encoding: 'utf8' }, function(err, source) {
			if (err) {
				throw err;
			}
			var html = handlebars.compile(source);
			res.send(200, html({
				routes: this.allRoutes,
				serverName: this.name
			}));
		}.bind(this));
	}.bind(this));

	app.get('/express-server/css/styles.css', function(req, res) {
		res.sendfile(path.join(__dirname, '../views/css/styles.css'));
	});

	done();
};