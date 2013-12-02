require.config({
    baseUrl:"../",
    paths: {
        "jQuery": "src/libs/jquery-1.10.2",
        "jquery-migrate": "src/libs/jquery-migrate-1.2.1",
        "lo-dash": "src/libs/lo-dash.2.3.2",
        "Backbone": "src/libs/backbone",
        "Epoxy": "src/libs/backbone.epoxy",
        "Bootstrap": "src/libs/bootstrap",
        "Bootstrap-datapicker": "src/libs/bootstrap-datepicker",
        "EJS": "src/libs/ejs",
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
    }
});

require([
    "unitTests/suits/LogFormatterSpec",
    "unitTests/suits/EpoxySpec",
    "unitTests/suits/ValuesSpec"
],function() {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    if(IsWindowLoaded) {
        execJasmine();
        return;
    }

    var currentWindowOnload = window.onload;
    window.onload = function() {
        if (currentWindowOnload) {
            currentWindowOnload();
        }
        execJasmine();
    };

    function execJasmine() {
        jasmineEnv.execute();
    }
});
