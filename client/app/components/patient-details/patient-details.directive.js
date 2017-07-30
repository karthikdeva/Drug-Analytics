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