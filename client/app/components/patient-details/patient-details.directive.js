(function() {
    'use strict';
    angular.module('patient-details', []).directive("patientDetails", ['$stateParams', 'allService', 'patientListService', function($stateParams, allService, patientListService) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/patient-details/patient-details.html',
            link: function(scope, element) {
                try {

                    $('.nav-tabs li a').click(function(event) {
                        event.preventDefault();
                    });

                    var promise1 = patientListService.getPatients(); // temp solution
                    promise1.then(function(res) {
                        var selectedPatient = patientListService.getSelectedPatient($stateParams.id);
                        scope.patientDetail = selectedPatient[0];
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