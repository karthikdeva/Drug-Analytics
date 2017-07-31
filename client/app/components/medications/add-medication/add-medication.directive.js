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
                        startDate: "2017-08-01",
                        endDate: "2017-09-01",
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
                    var p = patientListService.getPatients();
                    p.then(function(res) {
                        scope.selectedPatient = patientListService.getSelectedPatient($stateParams.id);
                    }, function(error) {
                        console.log(error);
                    });


                    scope.saveMedication = function() {
                        if (scope.selectedDrug.hasOwnProperty("normId")) {
                            scope.init.warning = "";
                            var activeMedication = allService.getCachedMedicationsByPatientId($stateParams.id);
                            var hasAsprin = false;
                            if (activeMedication) {
                                activeMedication.filter(function(item) {
                                    hasAsprin = item.normId == 1196 ? true : false;
                                    return hasAsprin;
                                })
                            }
                            console.log("activeMedication", activeMedication.length);
                            if (activeMedication.length && scope.selectedDrug.normId == 321208) {
                                var name = scope.selectedPatient[0] ? scope.selectedPatient[0].name : "He/She";
                                scope.init.warning = "<b>'" + name + "'</b> may affect the serious drug side affects with combination of current drug <b>'" + scope.selectedDrug.name + "'</b> with following medication";
                                scope.init.risk = "High";
                                $("#myModal").modal("show");
                            } else if (hasAsprin) {
                                var name = scope.selectedPatient[0] ? scope.selectedPatient[0].name : "He/She";
                                scope.init.warning = "You are prescribing <b>'" + scope.selectedDrug.name + "'</b> Asprin medication.<b> '" + name + "'</b> is already on Asprin medication. Please review the Medication";
                                scope.init.risk = "High";
                                $("#myModal").modal("show");
                            } else {
                                scope.confirmSave();
                            }
                        }
                    }
                    scope.confirmSave = function() {
                        var medicaton = {
                            id: $stateParams.id,
                            medication: scope.selectedDrug.name,
                            startDate: scope.init.startDate || null,
                            endDate: scope.init.endDate || null,
                            drugId: scope.selectedDrug.normId
                        }
                        var promise = allService.saveMedication(medicaton);
                        scope.init.message = "";
                        promise.then(function(res) {
                            $timeout(function() {
                                scope.init.message = "Saved Successfully";
                            }, 0);
                            $timeout(function() {
                                scope.init.message = "";
                            }, 2000);
                            // $(".form-control").val("");
                        }, function(error) {
                            console.log(error);
                        });
                    }

                } catch (e) {
                    console.warn("Error ", e.message);
                }
            }
        }
    }]);
})();