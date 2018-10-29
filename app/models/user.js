// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt  = require('bcrypt-nodejs');

//Se define el schema para el modelo usuario suando mongoose
var Schema = mongoose.Schema;
var userSchema = new Schema( {

    username         : String,
    rol              : {
      type           : String,
      default        : 'VISITANTE'
    },
    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        accountname  : String
    }
});

//Servicios para procesar los datos que se modelan

//Generacion del hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Chequeo para saber si pw es valida
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

//Creo el modelo para los usuarios y lo defino para usarlo en app
module.exports = mongoose.model('User', userSchema);
