/**
 * Created by osavch on 26.11.13.
 */
define(["jQuery", "underscore", "backbone", "src/js/models/GridModel", "src/js/collections/PartsGridCollection"], function ($, _, Backbone, GridModel, PartsGridCollection) {
    var partsGridCollection = new PartsGridCollection;
    describe('PartsGridCollection collection tests', function(){
        it("Should exist", function(){
            expect(PartsGridCollection).toBeDefined()
        });
        it("Should use the Grid model", function(){
            expect(partsGridCollection.model).toEqual(GridModel)
        });
    });
});