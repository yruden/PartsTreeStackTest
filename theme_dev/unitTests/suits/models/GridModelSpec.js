/**
 * Created by osavch on 25.11.13.
 */
define(["jQuery", "lo-dash", "Backbone", "src/js/models/GridModel"], function ($, _, Backbone, GridModel) {
    var gridModel = new GridModel();

    describe("Grid Model tests", function () {
        it("Model should exist", function () {
            expect(gridModel).toBeDefined();
        });
        it('Model should have defaults attributes', function () {
            expect(gridModel.attributes).toBeDefined();
        })
    });

});