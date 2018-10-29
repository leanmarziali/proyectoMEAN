'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiscoSchema = new Schema({
    
    nombre:{
        type: String,
        required: [true,'Ingrese un nombre del disco']
    },
    genero:{
        type: String,
        required: [true,'Ingrese un género']
    },
    anio:{
        type:String,
        required: [true,'Ingrese un año o fecha completa tipo dd-mm-aa']
    },
    resenias:[
        {
            nombreusuario:String,
            calificacion:{
                type: Number,
                min: 0,
                max: 5
            },
            comentario:String,
            fecha:{
                type:Date,
                default:Date.now
            }
        }
    ],
    canciones:[
        {
            nombre:String
        }
    ],
    autor:{
        type: String,
        required: [true,'Ingrese un autor']
    },

    spotify : {
        id  : String
     },

    tapa : String,

    relacionados : [
        {
        nombre: String, 
            idRel: String
        }
    ],

    uri : String
})

mongoose.model('Disco',DiscoSchema);