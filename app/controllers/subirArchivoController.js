/**
 * Crear file upload
 **/
var fs      = require('fs-extra');
//================================================

exports.subir = function (req, res) {

    // We are able to access req.files.file thanks to
    // the multiparty middleware
    var file = req.files.file;

    // get the temporary location of the file
    var tmp_path = file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    //Recupero el nombre del disco del cuerpo de la request
    var target_path = './public/img/portadas_discos/' + req.body.nombre + file.name.substring(file.name.indexOf('.'));
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + file.size + ' bytes');
        });
    });

    //Carry on
    return file;
};