(function() {
    'use strict';
    angular.module('dashboardModule', ['patientListService']).directive("dashboard", ['$stateParams', 'patientListService', function($stateParams, patientListService) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/dashboard/dashboard.tpl.html',
            link: function(scope, element) {
                try {
                    var promise = patientListService.getPatients();
                    promise.then(function(res) {
                        scope.patientList = res.data;
                    }, function(error) {
                        console.log(error);
                    });
                    scope.number = 7;
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