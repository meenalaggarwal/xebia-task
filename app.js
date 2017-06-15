var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes/index.js');

var app = express();

// Add a body parsing middleware to our API
app.use(bodyParser.json());

app.use('/', routes());

var port = 3000;

// Start the server
app.listen(port, function() {
    console.log('Service listening on port ' + port + '!');
});

// Not Found Error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    res.statusCode = 404;
    next(err);
});

// Error handler 
app.use(function(err, req, res, next) {
    res.send(err.toString());
});

module.exports = app;