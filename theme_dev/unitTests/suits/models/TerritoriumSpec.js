/**
 * Created by osavch on 26.11.13.
 */
define(["src/js/models/Territorium"], function (Territorium) {

    describe("TerritoriumSpec.js spec", function(){
        var territorium;

         beforeEach(function(){
             territorium = new Territorium();
         });

        describe("Grid Model tests", function () {

            it("Model should exist", function () {
                expect(Territorium).toBeDefined();
            });

            it('Model should have defaults attributes', function () {
                expect(territorium.attributes).toBeDefined();
            })
        });
    });


});