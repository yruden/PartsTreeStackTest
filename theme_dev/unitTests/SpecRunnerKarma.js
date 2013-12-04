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
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
