define([
    "jQuery",
    "underscore",
    "backbone",
    "src/js/views/CollectionView",
    "src/js/views/ItemView",
    "src/js/errors/ArgumentNotDefinedError",
    "src/js/collections/BrandCollection"
],
    function ($, _, Backbone, CollectionView, ItemView, ArgumentNotDefinedError, BrandCollection) {

        describe("CollectionViewSpec.js spec: CollectionView should", function () {
            var itemView,
                collection,
                collectionView;

            describe("during creation", function () {
                beforeEach(function () {
                    itemView = new Backbone.View();
                    collection = new Backbone.Collection();
                    collectionView = new CollectionView({itemView: itemView, collection: collection});
                });

                it("set itemView and collection properties with parameters passed into constructor", function () {
                    expect(collectionView).toBeDefined();
                    expect(collectionView.itemView).toBe(itemView);
                    expect(collectionView.collection).toBe(collection);
                });

                it("should has tag name  - 'ul'", function () {
                    expect(collectionView.tagName).toBe('ul');
                });

                it("throw if no options were passed to constructor", function () {
                    var collectionViewCreation = function () {
                        new CollectionView();
                    };
                    expect(collectionViewCreation).toThrow(new ArgumentNotDefinedError("options"));
                });

                it("throw if no itemView parameter was supplied", function () {
                    var collectionViewCreation = function () {
                        collection = new Backbone.Collection();
                        new CollectionView({collection: collection});
                    };
                    expect(collectionViewCreation).toThrow(new ArgumentNotDefinedError("options.itemView"));
                });

                it("throw if no collection parameter was supplied", function () {
                    var collectionViewCreation = function () {
                        itemView = new Backbone.View();
                        new CollectionView({itemView: itemView});
                    };
                    expect(collectionViewCreation).toThrow(new ArgumentNotDefinedError("options.collection"));
                });
            });

            describe("Should render data", function () {
                beforeEach(function () {
                    itemView = new Backbone.View();
                    collection = new BrandCollection();
                    collectionView = new CollectionView({itemView: itemView, collection: collection});
                    collection.fetch({restet: true});
                });


                it("method render should call once", function () {
                    expect(collectionView.render).toHaveBeenCalledOnce
                });

                it("should include the collection", function(){
                   expect(_.isObject(collectionView.collection)).toBeTruthy();
                });
            });

            describe("called with collection", function(){
                beforeEach(function(){

                    itemView = new Backbone.View();
                    collection = new BrandCollection();
                    collectionView = new CollectionView({itemView: itemView, collection: collection});
                    collection.fetch({restet: true});

                    collectionView = {
                        render: function(collecion){
                            this.collecion = collecion;
                        }
                    };
                    spyOn(collectionView, "render");
                    collectionView.render([{a: 1}, {b: 2}]);
                });

                it("has been called", function(){
                    expect(collectionView.render).toHaveBeenCalled();
                });

                it("length has equal to 1", function(){
                    expect(collectionView.render.calls.length).toEqual(1)
                });

                it("has been called with collection", function(){
                    expect(collectionView.render).toHaveBeenCalledWith([{a: 1}, {b: 2}]);
                });
            });
        });
    });