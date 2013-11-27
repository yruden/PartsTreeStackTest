/**
 * Created by osavch on 26.11.13.
 */
require.config({
    baseUrl:"",
    paths: {
        "jQuery": "src/libs/jquery-1.10.2.min",
        "jquery-migrate": "src/libs/jquery-migrate-1.2.1.min",
        "lo-dash": "src/libs/lo-dash.2.3.2",
        "Backbone": "src/libs/backbone",
        "backbone-pageable": "src/libs/backbone-pageable",
        "Epoxy": "src/libs/backbone.epoxy.min",
        "Bootstrap": "src/libs/bootstrap.min",
        "Bootstrap-datapicker": "src/libs/bootstrap-datepicker",
        "EJS": "src/libs/ejs_production",
        "text": "src/libs/text",
        "Backgrid": "src/libs/backgrid-0.2.6/backgrid.min",
        "Backgrid-filter": "src/libs/backgrid-0.2.6/extensions/filter/backgrid-filter.min",
        "Backgrid-moment-cell": "src/libs/backgrid-0.2.6/extensions/moment-cell/backgrid-moment-cell.min",
        "Backgrid-paginator": "src/libs/backgrid-0.2.6/extensions/paginator/backgrid-paginator.min",
        "Backgrid-select2-cell": "src/libs/backgrid-0.2.6/extensions/select2-cell/backgrid-select2-cell.min",
        "Backgrid-select-all": "src/libs/backgrid-0.2.6/extensions/select-all/backgrid-select-all.min",
        "Backgrid-text-cell": "src/libs/backgrid-0.2.6/extensions/text-cell/backgrid-text-cell.min"
    },
    text: {
        //Valid values are 'node', 'xhr', or 'rhino'
        env: 'rhino'
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
            deps: ["jQuery","lo-dash"],
            exports: "Backbone"
        },
//        "backbone-pageable": {
//            deps: ["lo-dash", "Backbone"],
//            exports: "backbonePageable"
//        },
        "Epoxy": {
            deps: ["Backbone"]
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
            deps: ["Backbone"]
        },
        "Backgrid-filter": {
            deps: ["Backgrid"]
        },
        "Backgrid-moment-cell": {
            deps: ["Backgrid"]
        },
        "Backgrid-paginator": {
            deps: ["Backgrid"]
        },
        "Backgrid-select2-cell": {
            deps: ["Backgrid"]
        },
        "Backgrid-select-all": {
            deps: ["Backgrid"]
        },
        "Backgrid-text-cell": {
            deps: ["Backgrid"]
        }
    }
});

require([
    "Backbone",
    "src/js/routers/MainRoute",
    "Backgrid"
],function(Backbone, MainRoute, Backgrid) {
    new MainRoute();
    Backbone.history.start();
});
