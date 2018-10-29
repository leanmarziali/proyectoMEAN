// route middleware to make sure a user is logged in

exports.isLoggedIn = function(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        //Continuo con el siguiente middleware
        return next();

    // if they aren't redirect them to the home page
    //kickeamos al user
    res.redirect('/');
    //Otra alternativa es
    //res.status(401).send( { message : req.flash('loginMessage', 'El Usuario no esta autenticado') } )
}

exports.isLoggedOut = function(req, res, next) {

    // if user is authenticated in the session, carry on
    if (!req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    //kickeamos al user
    res.redirect('/home');
}
exports.isAdmin = function(req, res, next) {
    //Si estoy ejecutando este middleware es porque ya verifique que exista
    //un usuario logueado, osea que este en la sesion
    if (req.user.rol == 'ADMIN')
        return next();

    // if they aren't redirect them to the home page
    //kickeamos al user
   res.redirect('/home');
}


exports.yaVoto = function(req,res,next){
    req.disco.resenias.forEach(function(r){
        if(r.nombreusuario == req.user.nombreusuario){
            res.redirect('/home');
        }
    });
    return next();
}

exports.render = function(req,res) {
    //Renderizo la pagina y paso data flash si es que existe
    //req.flash es la forma de obtener flashdata en la sesión
    //loginMessage lo creamos en la config de passport
    res.render('portada', {message: req.flash('loginMessage')});

 }

exports.readme = function(req,res){
    res.render('readme');
}