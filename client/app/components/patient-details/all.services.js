(function() {
    "use strict";
    angular.module('allService', [])
        .service('allService', ['$q', '$http', 'commonUtilService', function($q, $http, commonUtilService) {
            var medications = {};
            return {
                getDrugs: function() {
                    var deferred = $q.defer();
                    var apiUrl = commonUtilService.apiUrl + "drugs";
                    $http.get(apiUrl).then(function(data) {
                        deferred.resolve(data);
                    }, function myError(response) {
                        deferred.reject(response);
                    });
                    return deferred.promise;
                },
                checkMedications: function(normId) {
                    var deferred = $q.defer();
                    var apiUrl = commonUtilService.apiUrl + "adverse/" + normId;
                    $http.get(apiUrl).then(function(data) {
                        deferred.resolve(data);
                    }, function myError(response) {
                        deferred.reject(response);
                    });
                    return deferred.promise;
                },
                saveMedication: function(medication) {
                    var deferred = $q.defer();
                    var apiUrl = commonUtilService.apiUrl + "savemedication";
                    var config = {
                        'Content-Type': 'application/json'
                    };
                    this.setMedicationsByPatientId(medication.id, medication);
                    $http.post(apiUrl, medication, config).then(function(data) {
                        deferred.resolve(data);
                    }, function myError(response) {
                        deferred.reject(response);
                    });
                    return deferred.promise;
                },
                getCachedMedicationsByPatientId: function(patientId) {
                    return medications[patientId];
                },
                setMedicationsByPatientId: function(patientId, obj) {
                    return medications[patientId].push(obj);
                },
                getMedicationBypatientId: function(patientId) {
                    var deferred = $q.defer();
                    var apiUrl = commonUtilService.apiUrl + "patients/" + patientId + "/medication";
                    $http.get(apiUrl).then(function(response) {
                        deferred.resolve(response);
                        medications[patientId] = response.data;
                    }, function myError(response) {
                        deferred.reject(response);
                    });
                    return deferred.promise;
                },

            };
        }]);
})();