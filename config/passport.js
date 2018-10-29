// config/passport.js
'use strict';

//Load de las dependencias que se requieren
var LocalStrategy       = require('passport-local').Strategy;
var FacebookStrategy    = require('passport-facebook').Strategy;
var TwitterStrategy     = require('passport-twitter').Strategy;
var User                = require('../app/models/user');
var configuracion       = require('./autenticacion'); //Cargamos las variables para la autenticacion
//===============================================================================

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // Podrian estar en otro controlador pero la idea es definir toda la config de passport junta para mantener la app
    // limpia y concisa

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOGIN LOCAL PARA LOS ADMINISTRADORES
    // =========================================================================
    //Recupero la estrategia local y la uso en app.
    require('./local_strategy')(passport, LocalStrategy, User);

    // =========================================================================
    // LOGIN FACEBOOK
    // =========================================================================
    //Recupero la estrategia de facebook y la uso en app.
    require('./facebook_strategy')(passport, configuracion, FacebookStrategy, User);

    // =========================================================================
    // LOGIN TWITTER
    // =========================================================================
    //Recupero la estrategia de twitter y la uso en app.
    require('./twitter_strategy')(passport, configuracion, TwitterStrategy, User);

};
