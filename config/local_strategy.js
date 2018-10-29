// exponemos esta funcion a nuestra app usando module.exports
module.exports  = function(passport, LocalStrategy, User) {

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password
            passReqToCallback : true //Nos permite pasarle la request completa a la callback del login
        },
        function(req, username, password, done) { //callback con mail y pw recuperados del form de login

            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            //Uso los servicios que me brinda el modelo para buscar en la bd

            User.findOne( { 'username' : username}, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err) {
                    return done(err);
                }

                // if no user is found, return the message
                if ((!user) || (!user.validPassword(password)))
                // req.flash is the way to set flashdata using connect-flash
                // create the loginMessage and save it to session as flashdata
                    return done(null, false, req.flash('loginMessage', 'Username y/o password incorrecto/s!'));

                // all is well, return successful user
                return done(null, user);
            });

        }));
}