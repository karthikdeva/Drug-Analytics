;(function(window, document) {
(function() {
    "use strict";
    angular.module('drugAnalyticsApp', ['ui.select', 'ngSanitize', 'run', 'router', 'commonUtilService', 'loginModule', 'dashboardModule', 'patientDetailsModule', 'headerModule', 'medicationsModule', 'addMedicationModule']);
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
                    url: '/details/:id',
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
                apiUrl: "http://localhost:8484/api/"
            };
        }]);
})();
(function() {
    'use strict';
    angular.module('dashboardModule', ['commonUtilService', 'dashboardDirective', 'patientListService']);
})();
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
                // setPatients: function(patientList) {
                //     this.patients = patientList;
                // },
                getSelectedPatient: function(patientId) {
                    console.log(patients);
                    console.log(patientId);
                    var selectedPatient = patients.filter(function(item) {
                        return item.id == patientId;
                    });
                    return selectedPatient;
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
    angular.module('loginDirective', []).directive("login", ['$stateParams', '$state', function($stateParams, $state) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/login/login.html',
            link: function(scope, element) {
                try {
                    scope.init = {};
                    scope.login = function() {
                        if (scope.init.username && scope.init.password) {
                            $state.go("dashboard");
                        } else {
                            alert("User name and password are required");
                        }
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
(function() {
    'use strict';
    angular.module('medicationsModule', ['medications']);

})();
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
(function() {
    'use strict';
    angular.module('patientDetailsModule', ['patient-details', 'allService']);
})();
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
(function() {
    'use strict';
    angular.module('addMedicationModule', ['addMedication']);

})();
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
(function() {
    'use strict';
    angular.module('headerModule', ['header']);
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
                        scope.userName = "Clinician 1";
                        scope.projectName = "Drug Analysis";

                    } catch (e) {
                        console.warn("Error on Header Directive", e.message);
                    }
                }
            };
        }]);
})();
})(window, document);