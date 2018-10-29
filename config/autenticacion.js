// config/autenticacion.js - PUBLIC VERSION

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : 0, // your App ID
        'clientSecret'  : '', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : '',
        'consumerSecret'    : '',
        'callbackURL'       : 'http://localhost:3000/auth/twitter/callback' //Twiitter es caso especial.
    }

};
