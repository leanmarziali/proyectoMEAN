
module.exports = function(app, passport,multiparty) {

    var login = require('./controllers/loginController.js');
    app.get('/',login.isLoggedOut, login.render);

    //Procesamos los datos del form de login
    app.post('/', login.isLoggedOut, passport.authenticate('local-login', {
        successRedirect : '/home', // rederigimos al index
        failureRedirect : '/#login', // si hubo error redirigimos a la portada
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // UPLOADS DE PORTADAS
    // =====================================
    var archivos = require('./controllers/subirArchivoController.js');
    var multipartMiddleware = multiparty();
    //Realizo el procesamiento del archivo en la callback subir
    app.post('/upload',login.isLoggedIn, login.isAdmin, multipartMiddleware, archivos.subir);

    // =====================================
    // SECCION INDEX PROTEGIDA
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    var index = require('./controllers/indexController.js');
    app.get('/home', login.isLoggedIn, index.render);

    // =====================================
    // FACEBOOK
    // =====================================
    // Ruta para autenticacion de Facebook y login
    app.get('/auth/facebook',
            passport.authenticate('facebook',
                        {
                            scope : 'email' //Puedo agregar mas informacion al scope para que facebook me la de
                        }));

    //Manejamos la callback despues de que facebook haya autenticado al usuario
    app.get('/auth/facebook/callback',
            passport.authenticate('facebook',
                            {
                                successRedirect : '/home',
                                failureRedirect : '/#login'
                            }));

    // =====================================
    // TWITTER
    // =====================================
    // Ruta para autenticacion de Twitter y login
    app.get('/auth/twitter',
            passport.authenticate('twitter'));

    //Manejamos la callback despues de que twitter haya autenticado al usuario
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter',
            {
            successRedirect : '/home',
            failureRedirect : '/#login'
            }));

    // =====================================
    // SECCION ABM DISCOS PROTEGIDA
    // =====================================
    var discos = require('./controllers/discoController.js');
    /*Con post, agregas un nuevo disco. Con get, obtenes los discos */
    
    app.route('/discos')
        .post(login.isLoggedIn, login.isAdmin, discos.create)
        .get(discos.list);
    app.route('/discos/:discoId')
        .get(discos.read)
        .delete(login.isLoggedIn, login.isAdmin, discos.delete)
        .put(login.isLoggedIn, login.isAdmin, discos.update)
        .post(login.isLoggedIn,login.yaVoto,discos.comentar);
    
    //Defino parámetro middleware 'discotecaId'
    app.param('discoId',discos.discoByID);

    // =====================================
    // SECCION ABM DISCOTECAS PROTEGIDA
    // =====================================
    var discotecas = require('./controllers/discotecaController.js');
    /*Con post, agregas una nueva discoteca. Con get, obtenes las discotecas */
    app.route('/discotecas')
        .post(login.isLoggedIn, login.isAdmin, discotecas.create)
        .get(discotecas.list);
    app.route('/discotecas/:discotecaId')
        .get(discotecas.read)
        //Agrega un disco a la discoteca. El contenido del post es el id del nuevo disco.
        .post(login.isLoggedIn, login.isAdmin, discotecas.agregarDisco)
        //Elimina la discoteca
        .delete(login.isLoggedIn, login.isAdmin, discotecas.delete)
        //Actualiza la discoteca
        .put(login.isLoggedIn, login.isAdmin, discotecas.update);
        

    //Agrego disco a la discoteca

    //Defino parámetro middleware 'discotecaId'
    app.param('discotecaId',discotecas.discotecaByID);


    // =====================================
    // LOGOUT
    // =====================================
    var logout = require('./controllers/logoutController.js');
    app.get('/logout', logout.logout);

    app.route('/readme').get(login.readme);
};
