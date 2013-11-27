/**
 * Created by osavch on 26.11.13.
 */
define([
    "src/js/views/BackgridView",
    "src/js/collections/PageableTerritories"
], function (BackgridView, Territories) {

    var MainRoute = Backbone.Router.extend({
        routes: {
            '': 'index',
            "index": "index"
        },

        index: function(){
            var pageableTerritories = new PageableTerritories(),
                backgridView = new BackgridView({collection: territories});

            pageableTerritories.fetch({reset: true});
        }
    });

    return MainRoute;
});