require.config({
    baseUrl:"../",
    paths: {
        'lo-dash': 'media_dev/js/libs/lo-dash.2.3.2'
    },

    shim: {
        'lo-dash': {
            exports: '_'
        }
    }
});

require([
    "unitTests/suits/LogFormatterSpec"
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
