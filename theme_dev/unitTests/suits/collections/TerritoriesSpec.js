/**
 * Created by osavch on 26.11.13.
 */
define(["src/js/models/Territorium", "src/js/collections/Territories"],function(Territorium, Territories){

    describe("TerritoriesSpec.js spec", function(){
        var territories;

        beforeEach(function(){
            territories = new Territories;
        });

        describe("Territories collection should exists and have Territorium model", function(){
            it("Should exist", function(){
                expect(Territories).toBeDefined()
            });
            it("Should use the Territorium model", function(){
                expect(territories.model).toEqual(Territorium)
            });
        });

    });

});