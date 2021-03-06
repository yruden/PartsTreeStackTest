require.config({
    baseUrl:"../../theme_dev/",
    paths: {
        "jQuery": "src/libs/jquery-1.10.2",
        "jquery-migrate": "src/libs/jquery-migrate-1.2.1",
        "underscore": "src/libs/lo-dash.2.3.2",
        "backbone": "src/libs/backbone",
        "Epoxy": "src/libs/backbone.epoxy",
        "Bootstrap": "src/libs/bootstrap",
        "Bootstrap-datapicker": "src/libs/bootstrap-datepicker",
        "EJS": "src/libs/ejs",
        "text": "src/libs/text"
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
        }
    }
});

require([
        'src/js/views/CollectionView',
        'src/js/views/ItemView',
        'src/js/collections/BrandCollection',
        'Bootstrap'
    ], function(
        CollectionView,
        ItemView,
        BrandCollection
    ){

    var collection = new BrandCollection();
    var collectionView = new CollectionView({itemView: ItemView, collection: collection});
    collection.fetch({reset: true})
});