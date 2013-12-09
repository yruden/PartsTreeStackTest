/**
 * Created by osavch on 26.11.13.
 */
define(["backbone", "src/js/models/Territorium"],function(Backbone, Territorium){
    var Territories = Backbone.Collection.extend({
        model: Territorium,
        url: 'jsons/territories.json'
    });
    return Territories;
});
