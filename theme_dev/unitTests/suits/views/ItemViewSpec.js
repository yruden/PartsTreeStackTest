define([
    "jQuery",
    "underscore",
    "backbone",
    "src/js/views/ItemView",
    "src/libs/IEPolyfill"
], function ($, _, Backbone, ItemView) {

    describe("ItemViewSpec.js spec: ItemViewSpec should", function () {
        var itemView,
            model;

        describe("be available", function () {

            it("view", function () {
                expect(ItemView).toBeDefined();
            });

            it("model", function () {
                var model = {
                    "name": "Test name1",
                    "img": "../../theme/img/Untitled.jpg",
                    "url": "google.com"
                };
                itemView = new ItemView({model: model});
                expect(itemView.model).toBe(model);
            });
        });

        describe("display html", function(){

            beforeEach(function(){
                var model = {
                    "name": "Test name1",
                    "img": "../../theme/img/Untitled.jpg",
                    "url": "google.com"
                };
                itemView = new ItemView({model: model});
            });

            it("to be HTML element(s)", function(){
                expect(classof(itemView.el)).toBe('HTMLLIElement');
            });

        });
    });
});
