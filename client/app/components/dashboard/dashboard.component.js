(function() {
    'use strict';
    angular.module('dashboard', []).directive("dashboard", ['$stateParams', function($stateParams) {
        return {
            replace: true,
            restrict: 'AE',
            template: '<h1>Dashboard </h1>',
            link: function(scope, element) {
                try {} catch (e) {
                    console.warn("Error ", e.message);
                }
            }
        }
    }]);
})();