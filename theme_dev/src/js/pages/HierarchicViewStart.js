require([
        'source/js/views/CollectionView',
        'source/js/views/ItemView',
        'Bootstrap'
    ], function(
        CollectionView,
        ItemView
    ){
    var collectionView = new CollectionView({itemView: ItemView});
});