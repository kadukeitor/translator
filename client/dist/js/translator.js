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

'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('Translator.services', []).
    value('API', 'http://10.12.112.108:5010/');

'use strict';

/* Controllers */

angular.module('Translator.controllers', [])

    .controller('MainCtrl', function ($scope, $http, API) {

        $scope.bot = "es2en";
        $scope.query = "";
        $scope.result = "";

        $scope.$watch('query', function () {
            $scope.result = "";
        });

        $scope.translate = function () {

            if ($scope.query)
                if ($scope.query.indexOf('The translator is based on the API of Google to translate languages') > -1 ||
                    $scope.query.indexOf(' Translation is allowed up to 255 characters.') > -1)
                    $scope.result = "What's up :-)";
                else
                    $scope.mediaPromise = $http.get(API + '?q=' + $scope.query + '&bot=' + $scope.bot).
                        success(function (data) {
                            $scope.result = data.result;
                        }).
                        error(function () {
                            $scope.result = "ERROR";
                        });
        };

    })


;