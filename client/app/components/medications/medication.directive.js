(function() {
    'use strict';
    angular.module('medications', []).directive("medications", ['$stateParams', 'allService', 'patientListService', function($stateParams, allService, patientListService) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/medications/medications.html',
            link: function(scope, element) {
                try {

                    var promise = allService.getMedicationBypatientId($stateParams.id)
                    promise.then(function(res) {
                        scope.medications = allService.getCachedMedicationsByPatientId($stateParams.id);
                        console.log(scope.medications);
                    }, function(error) {
                        console.log(error);
                    });

                   

                } catch (e) {
                    console.warn("Error ", e.message);
                }
            }
        }
    }]);
})();