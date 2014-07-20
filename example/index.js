var ExpressServer = require('../express-server'),
	log = require('xqnode-logger');

var server = new ExpressServer({
	name: 'My Express Server',
	port: 3000
});

server.start(function() {
	log.sys('Application is ready! Go to http://localhost:' + server.port);
});

process.on('SIGINT', function() {
	server.stop();
	process.exit();
}.bind(this));