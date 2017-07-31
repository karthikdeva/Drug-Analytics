(function() {
    "use strict";
    angular.module('patientListService', [])
        .service('patientListService', ['$q', '$http', 'commonUtilService', function($q, $http, commonUtilService) {
            var patients = [];
            return {

                getPatients: function() {
                    var deferred = $q.defer();
                    var apiUrl = commonUtilService.apiUrl + "patients";
                    $http.get(apiUrl).then(function(data) {
                        deferred.resolve(data);
                        patients = data.data;
                    }, function myError(response) {
                        deferred.reject(response);
                    });

                    return deferred.promise;
                },

                getSelectedPatient: function(patientId) {
                    var selectedPatient = patients.filter(function(item) {
                        return item.id == patientId;
                    });
                    return selectedPatient;
                }

            };
        }]);
})();