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
                        scope.userName = "Clinician 1";
                        scope.projectName = "Drug Analysis";

                    } catch (e) {
                        console.warn("Error on Header Directive", e.message);
                    }
                }
            };
        }]);
})();