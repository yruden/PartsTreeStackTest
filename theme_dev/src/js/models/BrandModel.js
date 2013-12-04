/**
 * Created by osavch on 03.12.13.
 */
define(["backbone"], function (Backbone) {
    return Backbone.Model.extend({
        rootUrl: 'test/url',
        defaults: {
            name: null,
            img: null,
            url: null
        }
    });
});