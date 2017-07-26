;(function(window, document) {
(function() {
    "use strict";
    angular.module('drugAnalyticsApp', ['ngSanitize', 'run', 'router', 'commonUtilService', 'login']);
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
                apiUrl: "",
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
})(window, document);