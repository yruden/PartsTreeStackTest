/**
 * Created by osavch on 26.11.13.
 */
define([
    "src/js/views/BackgridView",
    "src/js/collections/PageableTerritories"
], function (BackgridView, PageableTerritories) {

    var MainRoute = Backbone.Router.extend({
        routes: {
            '': 'index',
            "index": "index"
        },

        index: function(){
            var pageableTerritories = new PageableTerritories(),
                backgridView = new BackgridView({collection: pageableTerritories});

            pageableTerritories.fetch({reset: true});
        }
    });

    return MainRoute;
});