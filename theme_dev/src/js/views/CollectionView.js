define(['backbone', 'underscore', 'jQuery','Epoxy'],function(Backbone, _, $){
    return Backbone.Epoxy.View.extend({
        constructor:function(){
            var args = Array.prototype.slice.apply(arguments);
            Backbone.Epoxy.View.constructor.apply(this, args);
        }
    });
});
