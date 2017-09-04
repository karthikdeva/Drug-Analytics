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