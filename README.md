#Express Server

Express Server is an easy to use node.js webserver based on express.js. It came with an integrated overview of your REST API. 

##Integration
Create folowing folder structure in your project root:

`
projectRoot
--------------------------
+-- server
	+-- env
		+-- development.js
		+-- production.js
	+-- database.js
	+-- express.js
	+-- init.js
+-- routes
	+-- myRoutes.js
	+-- moreRoutes.js
`

##Start an express server

`
var server = new ExpressServer({
	name: 'My Express Server',
	port: 3000
});
`