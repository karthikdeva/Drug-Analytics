(function() {
    'use strict';
    angular.module('loginDirective', []).directive("login", ['$stateParams', function($stateParams) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/login/login.html',
            link: function(scope, element) {
                try {

                } catch (e) {
                    console.warn("Error ", e.message);
                }
            }
        }
    }]);
})();