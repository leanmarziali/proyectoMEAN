
exports.render = function(req,res) {

    res.render('index', {
        titulo : 'Discotecas',
        user   : req.user //Le paso al template el usuario que se logeo
        });
}

