'use strict';

var Disco = require('mongoose').model('Disco');

//Crear un nuevo disco
exports.create = function(req,res,next){
    var disco = new Disco(req.body);

    disco.save(function(err){
        if(err){
            //Llamo al middleware con un msj de error
            return next(err);
        }
        else{
            //Uso el objeto response para enviar respuesta JSON
            res.json(disco);
        }
    })

}

//Lista los discos existentes
exports.list = function(req,res,next){
    Disco.find({},function(err,discos){

        if(err){
            return next(err);
        }
        else{
            res.json(discos);
        }
    })
}

//Obtener un disco en particular
exports.read = function(req,res){
    res.json(req.disco);
}

// Método 'discoByID' Permite recuperar un usuario en particular
exports.discoByID = function(req,res,next,id){

    Disco.findOne({
        _id: id
    },  function(err,disco){
            if(err){
                return next(err);
            }
            else{
                req.disco = disco;
                next();
            }
        }
    );

}

//Actualizacion de disco

exports.update = function(req,res,next){

    Disco.findByIdAndUpdate(req.disco.id,req.body,function(err,disco){
        if(err){
            return next(err);
        }
        else{
            res.json(disco);
        }
    })

}

// Método eliminar disco por id
exports.delete = function(req,res,next){

    req.disco.remove(function(err){
        if(err){
            return next(err);
        }
        else{
            res.json(req.disco)
        }
    })

}

exports.comentar = function(req,res,next){

    //Solo setea la reseña nueva
    var disco = Disco.findOneAndUpdate(
        {_id: req.body._id},
        {$set: {resenias: req.body.resenias}},
        {
            new: true
        },
        function(err,disco){
            if(err){
                return next(err);
            }
            else{
                res.json(disco);
            }
        });


}