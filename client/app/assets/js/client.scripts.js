;(function(window, document) {
(function() {
    "use strict";
    angular.module('drugAnalyticsApp', ['ui.select', 'ngSanitize',  'angularMoment', 'run', 'ui.bootstrap','ui.bootstrap.datetimepicker', 'router', 'commonUtilService', 'loginModule','uiDateFormat', 'dashboardModule', 'patientDetailsModule', 'headerModule', 'medicationsModule', 'addMedicationModule']);
})();
(function() {
    'use strict';
    angular
        .module('router', ['ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/dashboard');
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
    'use strict';
    angular.module('uiDateFormat', [])
        .directive('uiDateFormat', ['moment', function(moment) {
            return {
                replace: true,
                restrict: 'AE',
                require: 'ngModel',
                link: function(scope, element, attrs, ngModel) {
                    try {
                        var alternativeFormat;
                        var customFormat = {
                            parser: function(viewValue) {
                                var value = ngModel.$viewValue;
                                if (value) {
                                    var date = moment(new Date(value), [dateFormat, alternativeFormat], true);
                                    ngModel.$setValidity('date', date.isValid());
                                    return date.isValid() ? date._d : value;
                                }
                                return value;
                            },
                            formatDate: function(value) {
                                if (value) {
                                    var formatedValue = moment(new Date(value)).format(dateFormat);
                                }
                                return formatedValue;
                            }
                        };
                        ngModel.$formatters.push(customFormat.formatDate);

                        if (attrs.hasOwnProperty('uiDateFormat')) {
                            ngModel.$parsers.push(customFormat.parser);
                            var dateFormat = attrs.uiDateFormat;
                            alternativeFormat = dateFormat.replace('DD', 'D').replace('MM', 'M');
                        }

                    } catch (e) {
                        console.log("Error on uiDateFormat Directive", e.message);
                    }
                }
            };
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
                        scope.projectName = "Adverse Reactions Tracker (and Preventer)";

                    } catch (e) {
                        console.warn("Error on Header Directive", e.message);
                    }
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

                getSelectedPatient: function(patientId) {
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
    angular.module('addMedicationModule', ['addMedication','medicationTree']);

})();
(function() {
    'use strict';
    angular.module('addMedication', []).directive("addMedication", ['$stateParams', '$timeout', '$interval', 'allService', 'patientListService', function($stateParams, $timeout, $interval, allService, patientListService) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/medications/add-medication/add-medication.html',
            link: function(scope, element) {
                try {
                    scope.init = {
                        startDate: new Date(),
                        endDate: new Date(),
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

                        // promise.then(function(res) {
                        //     console.log(res.data);
                        // }, function(error) {
                        //     console.log(error);
                        // });
                    }

                    var p = patientListService.getPatients();
                    p.then(function(res) {
                        scope.selectedPatient = patientListService.getSelectedPatient($stateParams.id);
                    }, function(error) {
                        console.log(error);
                    });


                    scope.saveMedication = function() {
                        $timeout(function() {
                                  init();
                        }, 1000);

                        if (scope.selectedDrug.hasOwnProperty("normId")) {
                            scope.init.warning = "";
                            var activeMedication = allService.getCachedMedicationsByPatientId($stateParams.id);
                            var hasAsprin = false;
                            if (activeMedication) {
                                activeMedication.filter(function(item) {
                                    hasAsprin = item.normId == 1191 ? true : false;
                                    return hasAsprin;
                                })
                            }
                            console.log("activeMedication", activeMedication.length);
                            if (activeMedication.length && scope.selectedDrug.normId == 321208) {
                                var name = scope.selectedPatient[0] ? scope.selectedPatient[0].name : "He/She";
                                scope.init.warning = "<strong>'" + name + "'</Strong> has already on medication which may affect the serious drug side affects with combination of current drug <b>'" + scope.selectedDrug.name + "'</b>";
                                scope.init.risk = "High";
                                $("#myModal").modal("show");
                            } else if (true) {
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
                            problem: scope.init.problem,
                            startDate: moment(new Date(scope.init.startDate)).format("DD-MM-YYYY") || null,
                            endDate: moment(new Date(scope.init.endDate)).format("DD-MM-YYYY") || null,
                            drugId: scope.selectedDrug.normId
                        }
                        console.log(medicaton);
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

                    scope.endDateBeforeRender = endDateBeforeRender
                    scope.endDateOnSetTime = endDateOnSetTime
                    scope.startDateBeforeRender = startDateBeforeRender
                    scope.startDateOnSetTime = startDateOnSetTime

                    function startDateOnSetTime() {
                        scope.$broadcast('start-date-changed');
                    }

                    function endDateOnSetTime() {
                        scope.$broadcast('end-date-changed');
                    }

                    function startDateBeforeRender($dates) {
                        if (scope.init.endDate) {
                            var activeDate = moment(scope.init.endDate);

                            // $dates.filter(function(date) {
                            //     return date.localDateValue() >= activeDate.valueOf()
                            // }).forEach(function(date) {
                            //     date.selectable = false;
                            // })
                        }
                    }

                    function endDateBeforeRender($view, $dates) {
                        if (scope.init.startDate) {
                            var activeDate = moment(scope.init.startDate).subtract(1, $view).add(1, 'minute');

                            $dates.filter(function(date) {
                                return date.localDateValue() <= activeDate.valueOf()
                            }).forEach(function(date) {
                                date.selectable = false;
                            })
                        }
                    }

                    function ContinuousForceDirectedLayout() {
                        go.ForceDirectedLayout.call(this);
                        this._isObserving = false;
                    }
                    go.Diagram.inherit(ContinuousForceDirectedLayout, go.ForceDirectedLayout);

                    function init() {
                        var $ = go.GraphObject.make;
                        var myDiagram =
                            $(go.Diagram, "medicationsTree", {
                                allowMove: false,
                                allowZoom: false,
                                initialAutoScale: go.Diagram.Uniform,
                                contentAlignment: go.Spot.Center,
                                layout: $(ContinuousForceDirectedLayout, { defaultSpringLength: 40, defaultElectricalCharge: 100 })
                            });
                        myDiagram.toolManager.draggingTool.doMouseMove = function() {
                            go.DraggingTool.prototype.doMouseMove.call(this);
                            if (this.isActive) { this.diagram.layout.invalidateLayout(); }
                        }
                        myDiagram.nodeTemplate =
                            $(go.Node, "Auto",
                                $(go.Shape, "Circle", { click: function(e, obj) { console.log(e,obj); } }, { fill: "#07609a", stroke: "#fff", spot1: new go.Spot(0, 0, 5, 5), spot2: new go.Spot(1, 1, -5, -5) }),
                                $(go.TextBlock,
                                 { font: "bold 13pt arial, sans-serif", textAlign: "center", maxSize: new go.Size(120, NaN) },
                                    new go.Binding("fill", "color"),
                                    new go.Binding("text", "text"))
                               );
                          
                        myDiagram.linkTemplate =
                            $(go.Link,
                                $(go.Shape, { stroke: "#333" }),
                                $(go.Shape, { toArrow: "standard", stroke: null }),
                                $(go.Panel, "Auto",
                                    $(go.Shape, {
                                        fill: $(go.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                                        stroke: null
                                    }),
                                    $(go.TextBlock, {
                                            textAlign: "center",
                                            font: "10pt arial, sans-serif",
                                            stroke: "#333",
                                            margin: 4
                                        },
                                        new go.Binding("text", "text"))
                                )
                            );

                        // create the model for the concept map
                        var nodeDataArray = [
                            { key: 1, text: "Acetaminophen",color:go.Brush.randomColor() },
                            { key: 2, text: "Meloxicam",color:go.Brush.randomColor() },
                            { key: 3, text: "Tramadol",color:go.Brush.randomColor() },
                            { key: 4, text: "Metoprolol",color:go.Brush.randomColor() },
                            { key: 5, text: "test",color:go.Brush.randomColor()},
                            { key: 6, text: "Metoprolol",color:go.Brush.randomColor() }
                        ];
                        var linkDataArray = [
                            { from: 1, to: 2, text: "30mg" },
                            { from: 1, to: 3, text: "20mg" },
                            { from: 1, to: 4, text: "15mg" },
                            { from: 1, to: 5, text: "35mg" },
                            { from: 1, to: 6, text: "2mg" }
                                                    ];
                        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
                    }

                    function reload() {
                        var text = myDiagram.model.toJson();
                        myDiagram.model = go.Model.fromJson(text);
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
     angular.module('medicationTree', []).directive('medicationTree', [function() {
         return {
             restrict: 'E',
             template: '<div></div>', // just an empty DIV element
             replace: true,
           //  scope: { model: '=medicationModel' },
             link: function(scope, element, attrs) {
             
                }
         };
     }]);
 })();
})(window, document);