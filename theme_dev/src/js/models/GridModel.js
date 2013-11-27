/**
 * Created by osavch on 25.11.13.
 */
define(["Backbone"], function (Backbone) {
    var GridModel = Backbone.Model.extend({
        rootUrl: 'test/url',
        defaults: {
            revies: null
        }
    });
    return GridModel
});