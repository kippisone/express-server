#Express Server

Express Server is a easy to use node.js webserver based on express.js. It cames with an integrated overview of your REST API. 

##Integration
Create folowing folder structure in your project root:

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
