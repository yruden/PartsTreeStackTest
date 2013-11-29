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
            console.log('loaded...');
            var pageableTerritories = new PageableTerritories(),
                backgridView = new BackgridView({collection: pageableTerritories});
            console.log('loaded');
            pageableTerritories.fetch({reset: true});
        }
    });

    return MainRoute;
});