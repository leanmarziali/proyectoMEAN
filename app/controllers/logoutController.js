
//Crea nuevo controlador para el log out
exports.logout = function(req, res) {
    //Usamos el metodo logout de passport para hacer nuestro logout
    req.logout();
    //Redirecciona al user a la portada de la app
    res.redirect('/');
}
