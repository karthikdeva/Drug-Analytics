;(function(window, document) {
(function() {
    "use strict";
    angular.module('drugAnalyticsApp', ['ui.select', 'ngSanitize', 'run', 'router', 'commonUtilService', 'login']);
})();
(function() {
    'use strict';
    angular
        .module('router', ['ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');
            $stateProvider
                .state('login', {
                    url: '/login',
                    views: {
                        '': {
                            template: "<login></login>"
                        }
                    }
                }).state('dashboard', {
                    url: '/dashboard',
                    views: {
                        '': {
                            template: "<dashboard></dashboard>"
                        }
                    }
                });
        }]);
})();
(function() {
    'use strict';
    angular.module('run', ['ui.router']).run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);
})();

(function() {
    "use strict";
    angular.module('commonUtilService', [])
        .service('commonUtilService', [function() {
            return {
                apiUrl: "https://api.themoviedb.org/3/search/movie?api_key=49907b6cffad87bf22d3f0d5127c30e2",
            };
        }]);
})();

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
(function() {
    'use strict';
    angular.module('search', []).directive("search", ['searchMovies', 'moviesFactory', function(searchMovies, moviesFactory) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/search/search.html',
            link: function(scope, element) {
                try {
                    var language = "en-US";
                    scope.movieName = "";
                    scope.movies = [];
                    scope.recentSearchMovies = moviesFactory.getRecentSearchMovie();
                    scope.getMovies = function(movieName) {
                        if (movieName.length > 2) {
                            var promise = searchMovies.getMovies(movieName, language);
                            promise.then(function(res) {
                                if (res.hasOwnProperty('data')) {
                                    moviesFactory.setMoviesList(res.data.results);
                                    scope.movies = moviesFactory.getMovies();
                                }
                            }, function(error) {
                                console.log(error);
                            });
                        }
                    }

                } catch (e) {
                    console.warn("Error ", e.message);
                }
            }
        }
    }]);
})();

})(window, document);