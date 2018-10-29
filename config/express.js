var express         = require('express');
var morgan          = require('morgan'); //Puede ser reemplazado por passport
var compress        = require('compression');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var methodOverride  = require('method-override');
var cons            = require('consolidate');
var passport        = require('passport');
var session         = require('express-session');
var flash           = require('connect-flash');
var multiparty       = require('connect-multiparty');
//==================================================================================================

module.exports = function() {
    var app = express();
    // get all data/stuff of the body (POST) parameters
    // parse application/json
    app.use(bodyParser.json());
    // parse application/vnd.api+json as json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    require('./passport')(passport); // pass passport for configuration
    app.use(morgan('dev')); //logueo toda request en la consola
    app.use(cookieParser()); // read cookies (needed for auth)

    app.use(compress({
     // Levels are specified in a range of 0 to 9, where-as 0 is
     // no compression and 9 is best compression, but slowest
     level: 9
     }));
    // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(methodOverride('X-HTTP-Method-Override'));

    app.engine('html',cons.swig);
    app.set('view engine', 'html');
    app.set('views', './app/views');

    // required for passport
    // session secret. Se usa para calcular el hash de la sesión
    app.use(session({
        secret: '#proyecto3#meanApp#iaw#dcic#com104#uns#discotecas',
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session()); //Sesiones de login persistentes
    app.use(flash()); // use connect-flash for flash messages stored in session

    //Multipart para file uploads
    app.use(multiparty({
        uploadDir: './public/img/portadas_discos/'
    }));

    //Seteo de las rutas para app
    require('../app/routes.js')(app, passport, multiparty); //passing fully configured passport to be used in our routes

    // set the static files location e.g /public/img will be /img for users
    app.use(express.static('./public'));

    return app; //Instancia de la aplicacion
};
