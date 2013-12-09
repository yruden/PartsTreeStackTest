/**
 * Created by osavch on 27.11.13.
 */
define(["backbone", "backbonePageable", "src/js/models/Territorium"],function(Backbone, PageableCollection, Territorium){

    var PageableTerritories = PageableCollection.extend({
        model: Territorium,
        url: "jsons/pageable-territories.json",
        state: {
            pageSize: 15
        },
        mode: "client" // page entirely on the client side
    });

    return PageableTerritories;
});