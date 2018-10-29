'use strict';

var mongoose = require('mongoose');

//Defino el método de config de Mongoose

module.exports = function(){

    var db = mongoose.connect('mongodb://localhost:27017/discoteca');
    //Cargo el modelo 'disco'
    require('../app/models/disco');
    //Cargo el modelo 'discoteca'
    require('../app/models/discoteca');
    return db;
}