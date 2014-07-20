#Express Server

Express Server is a easy to use node.js webserver based on express.js

##Integration
Create folowing folder structure in your project root:
All these files are optional.

`
projectRoot
--------------------------
+-- server
	+-- env
		+-- development.js		//Dev config
		+-- production.js		//Production config
	+-- database.js				//Database connections
	+-- express.js				//Express config and adsons
	+-- init.js					//To be called when server was started
+-- routes
	+-- myRoutes.js				//Your routes
	+-- moreRoutes.js
`

##Start an express server

`
var server = new ExpressServer({
	name: 'My Express Server',
	port: 3000
});
`

##Setting up env configurations

`
module.exports = function(app, done) {
	'use strict';

	app.use(function(req, res, next){
		//Do something
		next();
	});

	done();
};
`

Don't forget to call the done function


##Connecting to a database

`
module.exports = function(app, done) {
	'use strict';

	//Make db connection

	done();
};


##Using express middlewares

`
module.exports = function(app, done) {
	'use strict';

	app.use(anyMiddleware);

	done();
};


##Init script

`
module.exports = function(app, done) {
	'use strict';

	//Doing something during server start progress

	done();
};


##Adding routes

Place routes under yourproject/routes/
All files in this folder will be called during the start progress


`
module.exports = function(app, done) {
	'use strict';

	app.get('/', function(req, res, next) {
		res.send('Hello World!');
		next();
	});

	done();
};