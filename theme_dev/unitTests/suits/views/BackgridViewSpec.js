/**
 * Created by osavch on 26.11.13.
 */
define([
    "jQuery",
    "underscore",
    "backbone",
    "src/js/views/BackgridView",
    "src/js/collections/Territories",
], function ($, _, Backbone, BackgridView, Territories) {

    describe("BackgridView spec", function () {
        var view, model;

        beforeEach(function () {
            view = new BackgridView({collection: new Territories()});
            console.log(view);
        });

        describe("When view is constructing", function () {
            it('should exist', function () {
                expect(view).toBeDefined();
            });
        });
    });

    describe('when view is initialized', function () {

        describe('without model', function () {

            it('should throw exception', function () {
                expect(function () {
                    new BackgridView();
                }).toThrow(new Error('collection is required'));
            });

        });
    });
});