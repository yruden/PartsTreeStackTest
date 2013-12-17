/**
 * Created by osavch on 17.12.13.
 */
$(function () {


    var ItemView = Backbone.Epoxy.View.extend({
        tagName: "li",
        template: new EJS({url: "templates/nodetpl.ejs"}),

        constructor: function (options) {
            if (!options) throw new ArgumentNotDefinedError("options");

            if (!options.model) {
                throw new ArgumentNotDefinedError("options.model");
            }

            var args = Array.prototype.slice.apply(arguments);
            Backbone.Epoxy.View.apply(this, args);
        },

        initialize: function () {
            this.render();
            return this;
        },

        render: function () {
            this.$el.html(this.template.render(this.model));

            if (this.model.hasOwnProperty('nodes')) {
                this.addSubNodes(this.model.nodes);
            }
            return this;
        },

        addSubNodes: function (nodes) {
            var subNodes = new SubNodes({
                itemView: ItemView,
                collection: nodes
            });

            this.$el.append(subNodes.el);
        }

    });


    var CollectionView = Backbone.Epoxy.View.extend({
        tagName: 'ul',

        constructor: function (options) {
            if (!options) throw new ArgumentNotDefinedError("options");
            if (!options.itemView) {
                throw new ArgumentNotDefinedError("options.itemView");
            }
            if (!options.collection) {
                throw new ArgumentNotDefinedError("options.collection");
            }
            this.itemView = options.itemView;

            var args = Array.prototype.slice.apply(arguments);
            Backbone.Epoxy.View.apply(this, args);
        },

        initialize: function () {
            this.collection.on('reset', this.render, this);
            return this;
        },

        render: function (collection) {
            var itemTpl,
                self = this;
            $.each(collection.models, function (key, obj) {
                itemTpl = new self.itemView({model: obj.toJSON()});
                self.$el.append(itemTpl.el);
            });
            return this;
        }
    });

    var SubNodes = CollectionView.extend({
        tagName: 'ul',

        initialize: function () {
            this.render();
            return this;
        },

        render: function () {
            var collection = this.collection,
                itemTpl,
                self = this;

            $.each(collection, function (key, obj) {
                itemTpl = new self.itemView({model: obj});
                self.$el.append(itemTpl.el);
            });

            return this;
        }
    });


    var TreeData = Backbone.Collection.extend({
        url: "jsons/treeData.json"
    })

    var collections = new TreeData();

    collections.fetch({reset: true});

    var collectionView = new CollectionView({
        itemView: ItemView,
        collection: collections
    });

    $('#tree').html(collectionView.el);


});