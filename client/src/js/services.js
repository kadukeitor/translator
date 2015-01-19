'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('Translator.services', []).
    value('API', 'http://10.12.112.108:5010/');
