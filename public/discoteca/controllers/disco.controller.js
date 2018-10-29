/*
    Trae el módulo de discosModulo.js (que está registrado en application.js
    y crea una funcion constructora DiscoControlador y le inyecta $scope
    donde le vas a pasar los datos que quieras.
*/
angular.module('discos',['spotify'])

    .factory('Discos',['$resource',

        function($resource){
            //Usar el service resource para devolver un objeto $resource disco
            return $resource('/discos/:discoId',{
                discoId: '@_id'
            },{
                update:{
                    method:'PUT'
                },
                comentar:{
                    method:'POST'
                }
            })
        }

        ])

    .config(function (SpotifyProvider) {
        SpotifyProvider.setClientId('b03d1025868f4a1b91f040220bd3d98b');
        //Para el login
        //SpotifyProvider.setRedirectUri('http:localhost:3000/spotify_auth.html');
        SpotifyProvider.setScope('playlist-read-private');
    })

    .controller('discoController',['$scope','$routeParams','$location','Authentication','Discos', 'Spotify', 'Upload', '$sce',

    function($scope,$routeParams,$location,Authentication,Discos,Spotify,Upload, $sce){

        $scope.nombre = '';

        $scope.$watch("nombre", function(newValue, oldValue) {

            if (newValue && $scope.nombre.length > 2) {

                Spotify.search($scope.nombre, 'album').then(function (data) {

                    var resultados = [];

                    if (data.albums.total > 0) {

                        for (i = 0; i < data.albums.items.length; i++) {

                            resultados.push({
                                "titulo": data.albums.items[i].name,
                                'preview': data.albums.items[i].images[2].url,
                                'numero': i + 1,
                                'id': data.albums.items[i].id
                            });
                        }

                    }

                    $scope.resultados = resultados;

                });

            }
        });

        $scope.armarDisco = function(albumId) {


            var actual = {};
            //Recupero mas datos del album actual
            Spotify.getAlbum($scope.resultados[albumId].id).then(function(data) {

                var genero = 'Moderno';
                if (data.genres.length > 0) {
                    genero = data.genres[0];
                }

                 actual = {
                    genero      : genero,
                    anio        : data.release_date,
                    autor       : data.artists[0].name,
                    canciones   : [],
                    id          : data.id,
                    uri         : data.uri
                }

                data.tracks.items.forEach(function(item) {
                    actual.canciones.push( {
                        'nombre' : item.name
                    } );
                });

                //Para poder recuperar los datos de actual, tengo que permanacer en la callback de la consulta a la api
                var relacionados = getRelacionados($scope.discos);

                 //Armo el disco
                var disco = new Discos({
                   nombre       : $scope.resultados[albumId].titulo,
                   genero       : actual.genero,
                   anio         : actual.anio,
                   autor        : actual.autor,
                   canciones    : actual.canciones,
                   spotify     : {
                        id: actual.id
                    },
                   relacionados : relacionados,
                   uri  : actual.uri
                });

            //Hago persistir el disco que el administrador creo
            guardarDisco(disco);

            });
        };

        $scope.file = null;
        $scope.porcentaje_subida = '';

        //MANEJO DE FILE UPLOADS
        // upload on file select or drop
        $scope.upload = function (file) {
            Upload.upload({
                url: '/upload',
                data: {file: file,
                       nombre : $scope.nombre }
            }).then(function (resp) {
                //Aca puedo devolver un mensaje de success!
            }, function (resp) {
                $scope.error = 'Subir Tapa - Error status: ' + resp.status;
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.porcentaje = 'progress: ' + progressPercentage + '% ' + evt.config.data.file.name;
            });
        };

        $scope.create= function() {
            //Estrategia Local

            //Upload del archivo
            if ($scope.form.file.$valid && $scope.file) {

                $scope.upload($scope.file);

                //Recupero la extension del archivo
                var src = $scope.file.name;
                var src = $scope.nombre + src.substring(src.indexOf('.'));

                //Recupero las canciones
                var arregloCanciones = [];
                $scope.choices.forEach(function (c) {
                    arregloCanciones.push({"nombre": document.getElementById(c.id).value});
                });

                //Para poder recuperar los datos de actual, tengo que permanacer en la callback de la consulta a la api
                var relacionados = getRelacionados(this.discos);

                //Recupero del post y creo un nuevo disco
                var disco = new Discos({
                    nombre: this.nombre,
                    genero: this.genero,
                    anio: this.anio,
                    autor: this.autor,
                    canciones: arregloCanciones,
                    tapa: 'img/portadas_discos/' + src,
                    relacionados : relacionados
                });

                //Hago persistir el disco que el administrador creo
                guardarDisco(disco);
            }
        };

        function getRelacionados(discos) {

            var relacionados = [];
            $scope.discos.forEach(function(item){
                if (item.seleccionado) { //El administrador chequeo este disco, lo agrego
                    relacionados.push({
                        nombre : item.nombre,
                        idRel  : item._id
                    });
                }
            })
          return relacionados;
        }

        function guardarDisco(disco) {

            //Uso $save de disco para enviar una petición POST
            disco.$save(function(response){
                $location.path('/');
            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };
        
        $scope.find = function(){
            var discos = Discos.query(function (data) {
                data.forEach(function(disco){

                    //Guardo un mapeo nombre - imagen para recuperarlas luego mas facil


                    //Le agrego a cada uno el checkbox
                    disco.seleccionado = false;
                    
                    if (disco.hasOwnProperty('spotify')){
                        Spotify.getAlbum(disco.spotify.id).then(function (data) {
                            disco.thumbnail = data.images[1].url;

                        });
                    }
                    else{
                        //Recuperar img de la lista
                        disco.thumbnail = disco.tapa;
                    }

                });

            });

            $scope.discos = discos;

        };

        $scope.findOne = function() {
            //Usar el método 'get' de disco para enviar un GET
            if ($routeParams.discoId) {

                var disco = Discos.get({
                    discoId: $routeParams.discoId

                }, function(album) {
                    
                    $scope.calcularPromedio();
                    $scope.votoDisco();

                    if (album.hasOwnProperty('spotify')) { //Traje el disco con spotify

                        //Recupero datos del disco con Spotify getAlbum
                        Spotify.getAlbum(album.spotify.id).then(function (data) {

                            var release = {
                                img : data.images[0].url
                            };

                            $scope.release = release;
                        });
                    } else { //Agregue un disco local

                        var release = {
                            img : album.tapa
                          };

                        $scope.release = release;
                    }

                });
                $scope.disco = disco;
            }
        };

        $scope.getIframeSrc = function (uriAlbum) {
            src = 'https://embed.spotify.com/?uri=' + uriAlbum;
            return $sce.trustAsResourceUrl(src);
        };

        $scope.update = function(){
            $scope.disco.$update(function(){
                //En success
               $location.path('/');
            }, function(errorResponse){
                //Si falla
                $scope.error = errorResponse.data.message;
            }
            );
        };

        //Método para borrar un único disco
        //Supone que lo borran desde una lista
        $scope.delete = function(disco){
            if(disco){
                disco.$remove(function(){
                    for(var i in $scope.discos){
                        if($scope.discos[i] == disco){
                            $scope.discos.splice(i,1);
                        }
                    }
                })
            }
        }

        //Cantidad dinámica de campos para las canciones

        $scope.choices = [];

        $scope.addNewChoice = function() {
            var newItemNo = $scope.choices.length+1;
            $scope.choices.push({'id' : 'choice' + newItemNo, 'name' : 'Cancion ', 'numero' : newItemNo  });
        };

        $scope.removeNewChoice = function() {
            var newItemNo = $scope.choices.length-1;
            if ( newItemNo >= 0 ) {
                $scope.choices.pop();
            }
        };

        $scope.showAddChoice = function(choice) {
            return choice.id === $scope.choices[$scope.choices.length-1].id;
        };

        
        //Reseñas
        $scope.comentario = '';
        $scope.votando = false;

        $scope.enVotacion = function(){
            return $scope.votando;
        };


        $scope.toggleVotacion = function(){
            $scope.votando=!$scope.votando;
        };

        $scope.agregarResenia=function(){

            var nueva = {
                calificacion : $scope.rate,
                comentario : $scope.comentario,
                nombreusuario : $scope.nombreUsuario
            };

            $scope.disco.resenias.push(nueva);
            //Hago efectivo el update
            $scope.disco.$comentar(function(disco){
                //Vuelvo a calcular el promedio
                 $scope.calcularPromedio();
                }, function(errorResponse){
                    $scope.error = errorResponse.data.message;
                }
            );

            $scope.calificacion=0;
            $scope.comentario="";
            $scope.votando = false;
            //Se vuelve a calcular
            $scope.votoDisco();

        };


        /*Control de que el usuario ya haya votado*/
        $scope.yaVoto = false;
        $scope.votoDisco = function(){
            $scope.disco.resenias.forEach(function(r){
                if(r.nombreusuario == $scope.nombreUsuario){
                    $scope.yaVoto=true;
                    return true;
                }
            })
        }

        $scope.calcularPromedio = function(){
            var suma=0;
            $scope.disco.resenias.forEach(function(r){
                suma += r.calificacion;
            });
            $scope.promedioCalificacion= (suma/$scope.disco.resenias.length).toFixed(0);
        };


        //Modulo rating
        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.rate = 3;
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent =5* (value / $scope.max);
        };
        ///////////////
        
        //Seteo del usuario autenticado
        $scope.nombreUsuario = Authentication.user.username;
        $scope.rol = Authentication.user.rol;

        //Colapable de comentarios
        $scope.isCollapsed = true;
        $scope.labelBotonComentar = "Ver Comentarios"

        $scope.colapsar = function(){
            if($scope.isCollapsed){
                $scope.labelBotonComentar = "Cerrar Comentarios";
            }
            else{
                $scope.labelBotonComentar = "Ver Comentarios";
            }
            $scope.isCollapsed = !$scope.isCollapsed;
        }

        //Ordenamiento de la lista izquierda
        $scope.ordenador = "autor";
        $scope.labelBotonOrdenar = "autor";

        $scope.ordenarPopularidad = function(disco){
            //Devuelve en orden inverso, del mas popular, al menos popular
            return -1* disco.resenias.length;
        }

        $scope.setOrden = function (string){

            if(string == 'popularidad'){
                $scope.ordenador = "ordenarPopularidad()";
            }
            else{
                $scope.ordenador = string;
            }
            $scope.labelBotonOrdenar = string;
        }

    }]
)

