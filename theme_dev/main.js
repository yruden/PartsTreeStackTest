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
        "BackbonePageable": "src/libs/backbone-pageable",
        "Epoxy": "src/libs/backbone.epoxy.min",
        "Bootstrap": "src/libs/bootstrap.min",
        "Bootstrap-datapicker": "src/libs/bootstrap-datepicker",
        "EJS": "src/libs/ejs_production",
        "text": "src/libs/text",
        "Backgrid": "src/libs/backgrid-0.2.6/backgrid.ie8_fixed",
        "BackgridFilter": "src/libs/backgrid-0.2.6/extensions/filter/backgrid-filter.min",
        "BackgridMomentCell": "src/libs/backgrid-0.2.6/extensions/moment-cell/backgrid-moment-cell.min",
        "BackgridPaginator": "src/libs/backgrid-0.2.6/extensions/paginator/backgrid-paginator",
        "BackgridSelect2Sell": "src/libs/backgrid-0.2.6/extensions/select2-cell/backgrid-select2-cell.min",
        "BackgridSelectAll": "src/libs/backgrid-0.2.6/extensions/select-all/backgrid-select-all.min",
        "BackgridTextCell": "src/libs/backgrid-0.2.6/extensions/text-cell/backgrid-text-cell.min",
        "lunr": "src/libs/lunr.min"
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
        "BackgridFilter": {
            deps: ["jQuery", "lo-dash","Backbone","Backgrid", "lunr"]
        },
        "BackgridMomentCell": {
            deps: ["Backgrid"]
        },
        "BackgridPaginator": {
            deps: ["jQuery", "lo-dash","Backbone","Backgrid"]
        },
        "BackgridSelect2Cell": {
            deps: ["jQuery", "lo-dash","Backbone","Backgrid"]
        },
        "BackgridSelectAll": {
            deps: ["jQuery", "lo-dash","Backbone","Backgrid"]
        },
        "BackgridTextCell": {
            deps: ["jQuery", "lo-dash","Backbone","Backgrid"]
        }
    }
});

require([
    "Backbone",
    "src/js/routers/MainRoute",
    "Backgrid"
],function(Backbone, MainRoute, Backgrid) {
    console.log('loaded...');
    new MainRoute();
    Backbone.history.start();
});
