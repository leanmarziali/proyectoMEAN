'use strict';

var Discoteca = require('mongoose').model('Discoteca');

//Crear una nueva discoteca
exports.create = function(req,res,next){

    var discoteca = new Discoteca(req.body);

    discoteca.save(function(err){
        if(err){
            //Llamo al middleware con un msj de error
            return next(err);
        }
        else{
            //Uso el objeto response para enviar respuesta JSON
            res.json(discoteca);
        }
    })

}


//Lista los discos existentes
exports.list = function(req,res,next){
    Discoteca.find({},function(err,discotecas){

        if(err){
            return next(err);
        }
        else{
            res.json(discotecas);
        }
    });
}

//Obtener una discoteca en particular
exports.read = function(req,res){
    res.json(req.discoteca);
}

// Método 'discoByID' Permite recuperar un usuario en particular
exports.discotecaByID = function(req,res,next,id){

    Discoteca.findOne({
            _id: id
        },  function(err,discoteca){
            if(err){
                return next(err);
            }
            else{
                req.discoteca = discoteca;
                next();
            }
        }
    );

}

//Actualizacion de discoteca

exports.update = function(req,res,next){

    Discoteca.findByIdAndUpdate(req.discoteca.id,req.body,function(err,discoteca){
        if(err){
            return next(err);
        }
        else{
            res.json(discoteca);
        }
    })

}

// Método eliminar discoteca por id
exports.delete = function(req,res,next){

    req.discoteca.remove(function(err){
        if(err){
            return next(err);
        }
        else{
            res.json(req.discoteca)
        }
    })

}

//Agrego un disco

exports.agregarDisco = function(req,res,next,id){

    Discoteca.findOne({
            _id: id
        },  function(err,discoteca){
            if(err){
                return next(err);
            }
            else{
                //discoNuevo es el id del disco
                discoteca.discos.push(req.discoNuevo);
                next();
            }
        }
    );

}