(function() {
    'use strict';
    angular.module('addMedication', []).directive("addMedication", ['$stateParams', '$timeout', 'allService', 'patientListService', function($stateParams, $timeout, allService, patientListService) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/medications/add-medication/add-medication.html',
            link: function(scope, element) {
                try {
                    scope.init = {
                        dosage: ["10mg", "15mg", "20mg", "25mg", "30mg"]
                    };

                    scope.selectedDrug = {};
                    var promise = allService.getDrugs()
                    promise.then(function(res) {
                        scope.drugs = res.data;
                    }, function(error) {
                        console.log(error);
                    });
                    scope.checkDrug = function(item, model) {
                        scope.selectedDrug = item;
                        scope.checkMedications(item.normId);
                    }
                    scope.checkDosage = function(item, model) {
                        scope.selectedDosage = item;
                    }

                    scope.checkMedications = function(normId) {
                        var promise = allService.checkMedications(normId);

                        promise.then(function(res) {
                            console.log(res.data);
                        }, function(error) {
                            console.log(error);
                        });
                    }
                    scope.saveMedication = function() {
                        if (scope.selectedDrug.hasOwnProperty("normId")) {
                            var medicaton = {
                                id: $stateParams.id,
                                medication: scope.selectedDrug.name,
                                startDate: scope.init.startDate || null,
                                endDate: scope.init.startDate || null,
                                drugId: scope.selectedDrug.normId
                            }
                            scope.init.warning = "";

                            //  var promise1 = allService.getMedicationBypatientId($stateParams.id)
                            if (scope.selectedDrug.normId == 321208) {

                                scope.init.warning = "It increases chance of internal bleeding or, if patient get a cut on his finger, the blood won't clot as quickly.";
                                scope.init.risk = "High";
                                $("#myModal").modal("show");
                            } else {
                                var promise = allService.saveMedication(medicaton);

                                promise.then(function(res) {
                                    var result = res.data.results[0];
                                    console.log("saveMedication", res);
                                    $timeout(function() {
                                        scope.init.message = result;
                                    }, 0);
                                    $timeout(function() {
                                        scope.init.message = "";
                                    }, 2000);
                                    $(".form-control").val("");
                                }, function(error) {
                                    console.log(error);
                                });
                            }
                        }
                    }


                } catch (e) {
                    console.warn("Error ", e.message);
                }
            }
        }
    }]);
})();