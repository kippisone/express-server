var log = require('xqnode-logger'),
	express = require('express'),
	path = require('path');

module.exports = function() {
	"use strict";

	var app;

	var ExpressServer = function(conf) {
		this.conf = conf || {};

		//Default port
		this.port = conf.port || 3000;

		//Default name
		this.name = conf.name || 'Express server';

		//Base dir
		this.baseDir = conf.baseDir || process.cwd();
	};

	/**
	 * Starts an express server
	 *
	 * @method start
	 */
	ExpressServer.prototype.start = function() {
		app = express();
		this.app = app;
		
		log.sys('Starting ' + this.name);
		log.sys(' ... environment:', app.get('env'));
		log.sys(' ... set base dir to:', this.baseDir);


		// app.use(express.logger('dev'));
		app.engine('.hbs', require('hbs').__express);
		app.set('view engine', 'hbs');
		app.set('views', path.join(this.baseDir, 'views'));
		app.baseDir = this.baseDir;


		/**
		 * Load Environment configuration
		 */
		var envConf;
		try {
			envConf = require.resolve(path.join(this.baseDir, 'environment', app.get('env')));
			log.sys(' ... load environment config');
			require(envConf)();
		}
		catch(err) {
			log.sys(' ... no environment config found!');
		}
		
		/**
		 * Routes
		 */
		require(path.join(this.baseDir, 'routes/index.js'))(app);

		/**
		 * Static files
		 */
		app.use(express.static(path.join(this.baseDir, 'public')));

		app.use(function(err, req, res, next) {
			console.error(err.stack);
			res.send(500, 'Something broke!\n');
		});

		log.sys(' ... listening on port ', this.port);
		app.listen(this.port);

		return app;	
	};

	/**
	 * Stopping express server
	 */
	ExpressServer.prototype.stop = function() {
		log.sys('Stoping ' + this.conf.name);
	};

	return ExpressServer;

}();