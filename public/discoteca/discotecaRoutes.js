// Invocar modo JavaScript 'strict'
'use strict';

angular.module('discos').config(['$routeProvider',

    function($routerProvider){
        $routerProvider.when('/',{
            templateUrl:'discoteca/views/ver.discos.view.html'

        }).
            when('/crear',{
            templateUrl:'discoteca/views/crear.disco.view.html',
            resolve:{
                "check":function(Authentication,$location){   //Para completar el ruteo se tienen que resolver check
                                                              //Le inyectamos el servicio de Authentication y location para el redirect
                    if(Authentication.user.rol != 'ADMIN'){    //check del rol del usuario - Esto se hace antes que se cargue la view de angular crear.disco
                        $location.path('/');//Si el usuario no es un admiin lo kickeamos a /home/ y vera el inicio
                       }
                    }
                }
        }).
            when('/discos/:discoId', {
            templateUrl: 'discoteca/views/ver.discos.view.html'
        }).
        otherwise({ /*Define el enrutamiento cuando no se encuentra la URL */
            redirectTo:'/'
        });
    }
    
])