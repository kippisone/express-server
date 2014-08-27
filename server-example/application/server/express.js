var path = require('path');

var session = require('express-session'),
    serveStatic = require('serve-static');

module.exports = function(app, done) {
    'use strict';

    app.set('trust proxy', true);
    app.set('x-powered-by', false);

    app.use(session({
        secret: 'My session secret',
        saveUninitialized: true,
        resave: true
    }));
  
    app.use(serveStatic(path.join(app.baseDir, '../webdocs')));

    done();
};
