//Limpia la url generada por el login de Facebook
if (window.location.href.indexOf('#_=_') > 0) {

    window.location = window.location.href.replace(/#.*/, '');

}