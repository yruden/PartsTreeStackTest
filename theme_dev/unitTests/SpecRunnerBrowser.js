require.config({
    baseUrl:"../",
    paths: {
        "jQuery": "src/libs/jquery-1.10.2",
        "jquery-migrate": "src/libs/jquery-migrate-1.2.1",
        "underscore": "src/libs/lo-dash.2.3.2",
        "backbone": "src/libs/backbone",
        "Epoxy": "src/libs/backbone.epoxy",
        "Bootstrap": "src/libs/bootstrap",
        "Bootstrap-datapicker": "src/libs/bootstrap-datepicker",
        "EJS": "src/libs/ejs",
        "text": "src/libs/text",

        "backbonePageable": "src/libs/backbone-pageable",
        "Backgrid": "src/libs/backgrid-0.2.6/backgrid.ie8_fixed",
        "BackgridFilter": "src/libs/backgrid-0.2.6/extensions/filter/backgrid-filter.min",
        "BackgridMomentCell": "src/libs/backgrid-0.2.6/extensions/moment-cell/backgrid-moment-cell.min",
        "BackgridPaginator": "src/libs/backgrid-0.2.6/extensions/paginator/backgrid-paginator",
        "BackgridSelect2Sell": "src/libs/backgrid-0.2.6/extensions/select2-cell/backgrid-select2-cell.min",
        "BackgridSelectAll": "src/libs/backgrid-0.2.6/extensions/select-all/backgrid-select-all.min",
        "BackgridTextCell": "src/libs/backgrid-0.2.6/extensions/text-cell/backgrid-text-cell.min",
        "lunr": "src/libs/lunr.min"
    },

    shim: {
        "underscore": {
            exports: '_'
        },
        "jQuery": {
            exports: '$'
        },
        "jquery-migrate": {
            deps: ["jQuery"]
        },
        "backbone": {
            exports: "Backbone",
            deps: ["jQuery","underscore"]
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
        },


        "Backgrid": {
            exports: "Backgrid",
            deps: ["backbone"]
        },
        "BackgridFilter": {
            deps: ["jQuery", "underscore","backbone","Backgrid", "lunr"]
        },
        "BackgridMomentCell": {
            deps: ["Backgrid"]
        },
        "BackgridPaginator": {
            deps: ["jQuery", "underscore","backbone","Backgrid"]
        },
        "BackgridSelect2Cell": {
            deps: ["jQuery", "underscore","backbone","Backgrid"]
        },
        "BackgridSelectAll": {
            deps: ["jQuery", "underscore","backbone","Backgrid"]
        },
        "BackgridTextCell": {
            deps: ["jQuery", "underscore","backbone","Backgrid"]
        }
    }
});

require([
    "unitTests/suits/views/CollectionViewSpec",
    "unitTests/suits/views/ItemViewSpec",
    "unitTests/suits/core/EventVentSpec",

    "unitTests/suits/collections/PartsGridCollectionSpec",
    "unitTests/suits/collections/TerritoriesSpec",
    "unitTests/suits/models/GridModelSpec",
    "unitTests/suits/models/TerritoriumSpec",

    "unitTests/suits/routers/mainRouteSpec",
    "unitTests/suits/views/BackgridViewSpec"
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
