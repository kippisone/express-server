module.exports = function(app, done) {
    'use strict';
    
    app.get('/', function(req, res) {
        res.send('Well done!')
    });

    done();
};