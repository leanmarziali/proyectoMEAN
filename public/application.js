'use strict';

var mainApplicationModuleName = 'mean';
var mainApplicationModule = angular.module(mainApplicationModuleName,['ngAnimate','ngtimeago','ngResource','ngRoute','users','discos','ui.bootstrap.rating','ui.bootstrap','ngSanitize','ngFileUpload']);

/*Hashbangs, sirve para que crawlers puedan indexar el contenido de tu página única*/
/*La idea es mejorar el seo para la app single page que se desarrolla*/
/*Con este esquema los los motores de búsqueda esperan por los ajaxs antes de abandonar la página*/
mainApplicationModule.config(['$locationProvider',
    function($locationProvider){
        $locationProvider.hashPrefix('!');
    }
])

/*Inicio la app*/
angular.element(document).ready(function(){
    angular.bootstrap(document,[mainApplicationModuleName]);
})