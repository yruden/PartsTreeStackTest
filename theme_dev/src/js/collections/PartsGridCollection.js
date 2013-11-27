/**
 * Created by osavch on 26.11.13.
 */
define(["Backbone", "src/js/models/GridModel"],function(Backbone, GridModel){
    var PartsGridCollection = Backbone.Collection.extend({
        model: GridModel,
        url: 'some/url'
    });
    return PartsGridCollection;
});
