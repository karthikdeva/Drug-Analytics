(function() {
    'use strict';
    angular.module('login', []).directive("login", ['$stateParams', function($stateParams) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/login/login.html',
            link: function(scope, element) {
                try {
                    //     scope.movie = moviesFactory.getMovieDetailsById($stateParams.id);
                } catch (e) {
                    console.warn("Error ", e.message);
                }
            }
        }
    }]);
})();