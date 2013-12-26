require([
    "backbone",
    "src/js/routers/MainRoute",
    "Backgrid"
],function(Backbone, MainRoute, Backgrid) {
    new MainRoute();
    Backbone.history.start();
});
