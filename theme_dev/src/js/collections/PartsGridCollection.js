/**
 * Created by osavch on 26.11.13.
 */
define(["jQuery", "underscore", "backbone", "src/js/models/GridModel"],function($, _, Backbone, GridModel){
    var PartsGridCollection = Backbone.Collection.extend({
        model: GridModel,
        url: 'some/url'
    });
    return PartsGridCollection;
});
