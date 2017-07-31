(function() {
    'use strict';
    angular.module('loginDirective', []).directive("login", ['$stateParams', '$state', function($stateParams, $state) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/login/login.html',
            link: function(scope, element) {
                try {
                    scope.init = {};
                    scope.login = function() {
                        if (scope.init.username && scope.init.password) {
                            $state.go("dashboard");
                        } else {
                            alert("User name and password are required");
                        }
                    }

                } catch (e) {
                    console.warn("Error ", e.message);
                }
            }
        }
    }]);
})();