// server.js

// modules =================================================
var mongoose	   = require('./config/mongoose');
var mngse          = require('mongoose');
var express        = require('./config/express');

// configuration ===========================================

var db = mongoose();
var app = express();

// connect to our mongoDB database
// (you could enter your own credentials in new file config/mongoose.js)
database = mngse.connection;
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function callback () {
    console.log('Conectado a MongoDB');
});

// set our port
var port = process.env.PORT || 3000;


// start app ===============================================
// startup our app at http://localhost:3000
app.listen(port);

// expose app
exports = module.exports = app;
