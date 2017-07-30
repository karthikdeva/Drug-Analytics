;(function(window, document) {
(function() {
    "use strict";
    angular.module('drugAnalyticsApp', ['ngSanitize', 'run', 'router', 'commonUtilService', 'loginModule', 'dashboardModule', 'patientDetailsModule', 'headerModule']);
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
                }).state('details', {
                    url: '/details',
                    views: {
                        '': {
                            template: "<patient-details></patient-details>"
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
    angular.module('dashboardModule', ['dashboardDirective']);
})();
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
(function() {
    'use strict';
    angular.module('headerModule', ['header'

    ]);
})();
(function() {
    'use strict';
    angular.module('header', [])
        .directive('mainHeader', [function() {
            return {
                replace: true,
                restrict: 'AE',
                templateUrl: 'components/header/header.html',
                link: function(scope, element) {
                    try {
                        scope.userName = "User1";
                        scope.projectName = "Drug Analytics";

                    } catch (e) {
                        console.warn("Error on Header Directive", e.message);
                    }
                }
            };
        }]);
})();
(function() {
    'use strict';
    angular.module('loginModule', ['loginDirective']);
})();
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
(function() {
    'use strict';
    angular.module('patientDetailsModule', ['patient-details']);
})();
(function() {
    'use strict';
    angular.module('patient-details', []).directive("patientDetails", ['$stateParams', function($stateParams) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/patient-details/patient-details.html',
            link: function(scope, element) {
                try {} catch (e) {
                    console.warn("Error ", e.message);
                }
            }
        }
    }]);
})();
})(window, document);