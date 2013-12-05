define([
        "backbone",
        "underscore",
        "jQuery",
        "src/js/errors/ArgumentNotDefinedError",
        "Epoxy"],
    function(
        Backbone,
        _,
        $,
        ArgumentNotDefinedError
    ){
    return Backbone.Epoxy.View.extend({
        el: '.list-group',
        tagName: 'ul',

        constructor:function(options){
            if(!options ) throw new ArgumentNotDefinedError("options");
            if(!options.itemView){
                throw new ArgumentNotDefinedError("options.itemView");
            }
            if(!options.collection){
                throw new ArgumentNotDefinedError("options.collection");
            }
            this.itemView = options.itemView;

            var args = Array.prototype.slice.apply(arguments);
            Backbone.Epoxy.View.apply(this, args);
        },

        initialize: function(){
            this.collection.on('reset', this.render, this);
            return this;
        },

        render: function(collection){
            var itemTpl,
                self = this;

            $.each(collection.toJSON(), function(key, obj){
                itemTpl = new self.itemView({model: obj});
                self.$el.append(itemTpl.el);
            });
        }
    });
});
