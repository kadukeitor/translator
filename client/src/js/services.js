'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('Translator.services', []).
    value('API', 'http://127.0.0.1:5000/');
