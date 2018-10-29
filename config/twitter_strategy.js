// exponemos esta funcion a nuestra app usando module.exports
module.exports  = function(passport, configuracion, TwitterStrategy, User) {

    passport.use(new TwitterStrategy( {

            consumerKey     : configuracion.twitterAuth.consumerKey,
            consumerSecret  : configuracion.twitterAuth.consumerSecret,
            callbackURL     : configuracion.twitterAuth.callbackURL

        },

        function(token, tokenSecret, profile, done) {

            // make the code asynchronous
            // User.findOne no se dispara hasta que se tengan todos los datos de twitter
            process.nextTick(function() {

                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser = new User();

                        // set all of the user data that we need
                        newUser.twitter.id          = profile.id;
                        newUser.twitter.token       = token;
                        newUser.twitter.accountname = profile.username;
                        newUser.username            = profile.displayName;

                        //Guardamos los datos del user en la bd
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            });

        }));
}