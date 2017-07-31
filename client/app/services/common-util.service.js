(function() {
    "use strict";
    angular.module('commonUtilService', [])
        .service('commonUtilService', [function() {
            return {
                apiUrl: "http://localhost:8484/api/"
            };
        }]);
})();