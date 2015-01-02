var fileExists = require('fs').existsSync,
	path = require('path'),
	fs = require('fs');

var log = require('xqnode-logger'),
	express = require('express'),
	glob = require('glob'),
	async = require('async'),
	extend = require('node.extend');

module.exports = function() {
	"use strict";

	var app, cbDone;

	var ExpressServer = function(conf) {
		conf = conf || {};

		//Load config file
		var serverConf = require(path.join(__dirname, '../conf/', (process.env.NODE_ENV || 'development') + '.json'));
		conf = extend({}, serverConf, conf);

		console.log('CONF', conf);
		
		if (conf.logLevel) {
			log.setLevel(conf.logLevel);
		}
		else {
			log.setLevel('sys');
		}

		//Default port
		this.port = conf.port || 3000;

		//Default name
		this.name = conf.name || 'Express server';

		//Base dir
		this.baseDir = conf.baseDir || process.cwd();

		//API route (Default is disabled)
		this.apiRoute = conf.apiRoute || null;

		//Request logging config
		if (conf.requestLog) {
			this.requestLogFile = conf.requestLog === true ? path.join(this.baseDir, 'log', 'request.log') : conf.requestLog;
			if (this.requestLogFile.charAt(0) === '.') {
				this.requestLogFile = path.join(this.baseDir, this.requestLogFile);
			}

			this.requestLogIgnore = {
				contentType: null
			};
		}

		//Enable user tracking
		if (conf.userTracking) {
			this.userTracking = conf.userTracking === true ? path.join(this.baseDir, 'log', 'usertracking.log') : conf.userTracking;
			if (this.userTracking.charAt(0) === '.') {
				this.userTracking = path.join(this.baseDir, this.userTracking);
			}

			
		}

		this.allRoutes = [];

		app = express();
		app.express = express;
		app.logger = log;
		this.app = app;
	};

	/**
	 * Starts an express server
	 *
	 * @method start
	 */
	ExpressServer.prototype.start = function(opts, callback) {
		if (typeof opts === 'function') {
			callback = opts;
			opts = null;
		}

		opts = opts || {
			disableServer: false
		};

		cbDone = false;
		if (!callback) {
			callback = function() {};
		}

		app.addRoute = function(method, path, info, options, callback) {
			if (typeof options === 'function') {
				callback = options;
				options = null;
			}

			var fn = Array.prototype.slice.call(arguments);
			while(fn.length > 0 && typeof fn[0] !== 'function') {
				fn.shift();
			}

			fn.unshift(path);
			app[method.toLowerCase()].apply(app, fn);
			this.allRoutes.push({
				method: method,
				path: path,
				info: info,
				options: options,
				callback: callback
			});
		}.bind(this);

		log.sys('Starting ' + this.name);
		log.sys(' ... environment:', app.get('env'));
		log.sys(' ... set base dir to:', this.baseDir);

		app.baseDir = this.baseDir;

		//Enable request logging
		if (this.requestLogFile) {
			log.sys(' ... log requests to:', this.requestLogFile);
			app.use(this.requestLogger.bind(this));
		}

		var jobs = [];

		//Load Environment configuration
		var envConf = path.join(this.baseDir, 'server/env', app.get('env') + '.js');
		if (fileExists(envConf)) {
			jobs.push(function(callback) {
				log.sys(' ... load environment config');
				require(envConf).call(this, app, callback);
			}.bind(this));
		}
		else {
			log.sys(' ... no environment config found!');
		}
		
		//Load express.js
		var expressFile = path.join(app.baseDir, 'server/express.js');
		if (fileExists(expressFile)) {
			jobs.push(function(callback) {
				log.sys(' ... Load express.js');
				require(expressFile)(app, callback);
			}.bind(this));
		}

		//Load database.js
		var databaseFile = path.join(app.baseDir, 'server/database.js');
		if (fileExists(databaseFile)) {
			jobs.push(function(callback) {
				log.sys(' ... Load database.js');
				require(databaseFile)(app, callback);
			}.bind(this));
		}

		//Load routes
		if (opts.disableRoutes !== true) {
			var routesDir = path.join(this.baseDir, 'routes/**/*.js');
			var files = glob.sync(routesDir);
			if (files.length !== 0) {
				files.forEach(function(file) {
					jobs.push(function(callback) {
						log.sys(' ... load route', file);
						require(file).call(this, app, callback);
					}.bind(this));
				}.bind(this));
			}
			else {
				log.sys(' ... no routes found');
			}
		}

		//Load API view
		if (this.apiRoute) {
			jobs.push(function(callback) {
				log.sys(' ... register api route', this.apiRoute);
				require(path.join(__dirname, 'routes/api')).call(this, app, callback);
			}.bind(this));
		}

		//Enable user tracking
		if (this.userTracking) {
			this.trackingRoute = this.trackingRoute || '/track';
			jobs.push(function(callback) {
				log.sys(' ... track user to:', this.userTracking);
				require(path.join(__dirname, 'routes/tracking')).call(this, app, callback);
			}.bind(this));
		}

		
		async.series(jobs, function(err, result) {
			if (cbDone) {
				return;
			}

			cbDone = true;

			if (err) {
				log.err('Can\'t boot the server.');
				log.err((err.message || err));
				process.exit(1);
				return;
			}

			app.use(function(err, req, res, next) {
				console.error(err.stack);
				res.send(500, 'Something broke!\n');
			});

			if (opts.disableServer !== true) {
				log.sys(' ... listening on port ', this.port);
				log.sys('Server started successfull!');
				app.listen(this.port);
			}

			//Load init script
			var initFile = path.join(app.baseDir, 'server/init.js');
			if (fileExists(initFile)) {
				require(initFile)(app, callback.bind(this, app));
			}
			else {
				
				callback.call(this, app);
			}

		}.bind(this));

		return app;	
	};

	/**
	 * Stopping express server
	 */
	ExpressServer.prototype.stop = function() {
		log.sys('Stoping ' + this.name);
	};

	/**
	 * Handle JSON result
	 */
	ExpressServer.prototype.handleJSONResult = function(err, data) {
		if (err) {
			log.err(err);
			this.send(500, 'Something went wrong!');
			return;
		}

		this.json(data);
	};

	ExpressServer.prototype.requestLogger = function(req, res, next) {
		var startTime = Date.now(),
			logFile = this.requestLogFile,
			ignoreContentTypes = this.requestLogIgnore.contentType;

		var LogIt = function() {
			var parseTime = Date.now() - startTime,
				contentType = res.get('content-type');

			res.removeListener('finish', LogIt);

			if (ignoreContentTypes && ignoreContentTypes.indexOf(contentType) !== -1) {
				return;
			}

			var data = '[' + (new Date()).toString() + ']';
			data += ' ' + res.statusCode;
			data += ' ' + parseTime + 'ms';
			data += ' ' + req.method;
			data += ' "' + req.protocol;
			data += '://' + req.get('host');
			data += req.originalUrl + '"';
			data += ' "' + contentType + '"';
			data += ' "' + req.get('user-agent') + '"';
			data += ' "' + req.get('referer') + '"';
			if (req.sessionID) {
				data += ' (' + req.sessionID + ')';
			}
			data += '\n';

			fs.appendFile(logFile, data, function() {});
		};

		res.on('finish', LogIt);

		next();
	};

	return ExpressServer;

}();