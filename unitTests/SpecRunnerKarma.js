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
        "lo-dash": "media/lib/lo-dash.2.3.2",
        "jQuery": "media/lib/jquery-1.10.2.min",
        "jquery-migrate": "media/lib/jquery-migrate-1.2.1.min",
        "Backbone": "media/lib/backbone",
        "Epoxy": "media/libbackbone.epoxy.min"
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
            exports: "Backbone"
        },
        "Epoxy": {
            deps: ["backbone"]
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
