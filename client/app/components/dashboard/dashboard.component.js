(function() {
    'use strict';
    angular.module('dashboardModule', []).directive("dashboard", ['$stateParams', function($stateParams) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/dashboard/dashboard.tpl.html',
            link: function(scope, element) {
                try {

                    scope.number = 8;
                    scope.getNumber = function(num) {
                        return new Array(num);
                    }

                } catch (e) {
                    console.warn("Error ", e.message);
                }
            }
        }
    }]);
})();