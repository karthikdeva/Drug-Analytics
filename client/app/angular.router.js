(function() {
    'use strict';
    angular
        .module('router', ['ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/dashboard');
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
                }).state('details', {
                    url: '/details/:id',
                    views: {
                        '': {
                            template: "<patient-details></patient-details>"
                        }
                    }
                });
        }]);
})();