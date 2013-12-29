define(
    [
        'backbone',
        'underscore',
        'jQuery',
        'EJS',
        "text!src/templates/BrandItem.html",
        "src/js/errors/ArgumentNotDefinedError",
        'Epoxy'], function (Backbone, _, $, EJS, tpl, ArgumentNotDefinedError) {

        return Backbone.Epoxy.View.extend({
            tagName: "li",
            template: new EJS({text: tpl}),

            constructor: function (options) {
                if (!options) throw new ArgumentNotDefinedError("options");

                if (!options.model) {
                    throw new ArgumentNotDefinedError("options.collection");
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
                return this;
            }
        });
    });
