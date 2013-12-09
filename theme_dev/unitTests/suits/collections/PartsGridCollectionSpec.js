/**
 * Created by osavch on 26.11.13.
 */
define(["jQuery", "underscore", "backbone", "src/js/models/GridModel", "src/js/collections/PartsGridCollection"], function ($, _, Backbone, GridModel, PartsGridCollection) {

    describe('PartsGridCollectionSpec.js spec', function(){
        var partsGridCollection;

        beforeEach(function(){
            partsGridCollection = new PartsGridCollection;
        });

        describe("PartsGridCollection collection should exists and have GridModel model", function(){
            it("Should exist", function(){
                expect(PartsGridCollection).toBeDefined()
            });
            it("Should use the Grid model", function(){
                expect(partsGridCollection.model).toEqual(GridModel)
            });
        });
    });
});