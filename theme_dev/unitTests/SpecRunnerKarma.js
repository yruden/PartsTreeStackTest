var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/Spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: "/base",

    paths: {
        "jQuery": "src/libs/jquery-1.10.2",
        "jquery-migrate": "src/libs/jquery-migrate-1.2.1",
        "lo-dash": "src/libs/lo-dash.2.3.2",
        "Backbone": "src/libs/backbone",
        "Epoxy": "src/libs/backbone.epoxy",
        "Bootstrap": "src/libs/bootstrap",
        "Bootstrap-datapicker": "src/libs/bootstrap-datepicker",
        "EJS": "src/libs/ejs_production",
        "text": "src/libs/text.js"
    },

    shim: {
        "lo-dash": {
            exports: '_'
        },
        "jQuery": {
            exports: '$'
        },
        "jquery-migrate": {
            deps: ["jQuery"]
        },
        "Backbone": {
            exports: "Backbone",
            deps: ["jQuery","lo-dash"]
        },
        "Epoxy": {
            deps: ["backbone"]
        },
        "Bootstrap": {
            deps: ["jQuery"]
        },
        "Bootstrap-datapicker": {
            deps: ["Bootstrap"]
        },
        "EJS": {
            exports: "EJS"
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
