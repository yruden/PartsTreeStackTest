/**
 * Created by osavch on 26.11.13.
 */
define([
    "jQuery",
    "lo-dash",
    "Backbone",
    "EJS",
    "text!templates/BodyTpl.html",
    "Backgrid",
    "src/js/gridTemplates/TerritoriesGridColumns"
], function ($, _, Backbone, EJS, tpl, Backgrid, territoriesGridColumns) {

    var BackgridView = Backbone.View.extend({
        el: "body",
        template: new EJS({text: tpl}),

        initialize: function (options) {

            if (!this.collection) {
                throw new Error('collection is required');
            }
            this.render();
            this.collection.on('reset', this.addGrid, this);
        },

        render: function () {
            this.$el.append(this.template.render());
            return this;
        },

        addGrid: function(territories){

            // Set up a grid to use the pageable collection
            var grid = new Backgrid.Grid({
                columns: territoriesGridColumns,
                collection: territories
            });
            // Render the grid
            $("#example-grid").append(grid.render().$el);

        }
    });

    return BackgridView;
});