// Define Default Paths
var path = {
    vendorFilePath: 'node_modules/',
    app: "app"
};
var config = {
    rootPath: "./app/",
    assetsPath: path.app + "/assets/",
    vendorCss: {
        dist: path.app + "/assets/css/",
        src: [
            path.vendorFilePath + "animate.css/animate.min.css",
            path.vendorFilePath + "angular-bootstrap-datetimepicker/src/css/datetimepicker.css",
            path.vendorFilePath + "ui-select/dist/select.min.css"
        ]
    },
    vendorJs: {
        dist: path.app + "/assets/js",
        src: [
            path.vendorFilePath + "angular/angular.min.js",
            path.vendorFilePath + "angular-sanitize/angular-sanitize.js",
            path.vendorFilePath + "@uirouter/angularjs/release/angular-ui-router.min.js",
            path.vendorFilePath + "jquery/dist/jquery.min.js",
            "app/vendor/cytoscape.js",
            "app/vendor/go.js",
            path.vendorFilePath + "ngCytoscape/dist/ngCytoscape.min.js",
            path.vendorFilePath + "bootstrap/dist/js/bootstrap.min.js",
            path.vendorFilePath + "moment/min/moment.min.js",
            path.vendorFilePath + "angular-moment/angular-moment.js",
            path.vendorFilePath + "angular-bootstrap/ui-bootstrap-tpls.min.js",
            path.vendorFilePath + "angular-bootstrap-datetimepicker/src/js/datetimepicker.js",
            path.vendorFilePath + "angular-bootstrap-datetimepicker/src/js/datetimepicker.templates.js",
            path.vendorFilePath + "ui-select/dist/select.js"
        ]
    },
    styleSheets: {
        dist: path.app + "/assets/css",
        src: [path.app + '/assets/sass/*.scss']
    },
    scripts: {
        dist: path.app + "/assets/js",
        src: [
            path.app + '/*.js',
            path.app + "/directives/*.js",
            path.app + "/services/*.js",
            path.app + "/factory/*.js",
            path.app + "/directives/*.js",
            path.app + "/components/**/*.js"
        ]
    },
    build: {
        src: [
            path.app + '/**/*.*',
            '!' + path.app + '/index.html',
            '!' + path.app + '/**/sass',
            '!' + path.app + '/**/sass/**',
            '!' + path.app + '/components/**/*.scss',
            '!' + path.app + '/directives',
            '!' + path.app + '/directives/**',
            '!' + path.app + '/factory',
            '!' + path.app + '/factory/**',
            '!' + path.app + '/services',
            '!' + path.app + '/services/**',
            '!' + path.app + '/*.js',
            '!' + path.app + '/components/**/*.js'
        ]
    },
    unitTest: {
        src: [path.app + "/unit-test/*.js"]
    },
    fonts: [],
};

module.exports = config;