'use strict';


// Declare app level module which depends on filters, and services
angular.module('Translator', [
    'ngRoute',
    'cgBusy',
    'Translator.services',
    'Translator.controllers'
]).
    config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

    }]);
