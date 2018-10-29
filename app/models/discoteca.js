'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiscotecaSchema = new Schema({
    nombre:String,
    descripcion:String,
    discos:[
        {
            id:String
        }
    ]
})

mongoose.model('Discoteca',DiscotecaSchema);