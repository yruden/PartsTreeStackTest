/**
 * Created by osavch on 03.12.13.
 */
define(["backbone", "src/js/models/BrandModel"], function (Backbone, BrandModel) {
    return Backbone.Collection.extend({
        model: BrandModel,
        url: '../json/brands.json'
    });
});