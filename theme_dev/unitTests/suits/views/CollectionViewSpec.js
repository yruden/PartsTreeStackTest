define([
        "jQuery",
        "underscore",
        "backbone",
        "src/js/views/CollectionView",
        "src/js/views/ItemView",
        "src/js/errors/ArgumentNotDefinedError"
    ],
    function (
        $,
        _,
        Backbone,
        CollectionView,
        ItemView,
        ArgumentNotDefinedError
    ){
    describe("Collection View should", function(){
        var itemView,
            collection,
            collectionView;

        describe("during creation", function(){
            it("set itemView and collection properties with parameters passed into constructor", function(){
                itemView = new ItemView();
                collection = new Backbone.Collection();
                collectionView = new CollectionView({itemView:itemView, collection:collection});
                expect(collectionView).toBeDefined();
                expect(collectionView.itemView).toBe(itemView);
                expect(collectionView.collection).toBe(collection);
            });

            it("throw if no options were passed to constructor", function(){
                var collectionViewCreation = function(){
                    new CollectionView();
                };
                expect(collectionViewCreation).toThrow(new ArgumentNotDefinedError("options"));
            });

            it("throw if no itemView parameter was supplied", function(){
                var collectionViewCreation = function(){
                    collection = new Backbone.Collection();
                    new CollectionView({collection: collection});
                };
                expect(collectionViewCreation).toThrow(new ArgumentNotDefinedError("options.itemView"));
            });

            it("throw if no collection parameter was supplied", function(){
                var collectionViewCreation = function(){
                    itemView = new ItemView();
                    new CollectionView({itemView:itemView});
                };
                expect(collectionViewCreation).toThrow(new ArgumentNotDefinedError("options.collection"));
            });
        });

        describe("", function(){

        });
    });
});