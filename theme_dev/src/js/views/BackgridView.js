/**
 * Created by osavch on 26.11.13.
 */
define([
    "jQuery",
    "underscore",
    "backbone",
    "EJS",
    "text!templates/BodyTpl.html",
    "Backgrid",
    "src/js/gridTemplates/TerritoriesGridColumns",
    "BackgridPaginator",
    "BackgridFilter"
], function ($, _, Backbone, EJS, tpl, Backgrid, territoriesGridColumns) {
    // "use stric";

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
            // Render the grid
            var $gridContainer = $("#example-grid");
            $gridContainer.empty();

            // Set up a grid to use the pageable collection
            var grid = new Backgrid.Grid({
                columns: territoriesGridColumns,
                collection: territories
            });

            $gridContainer.append(grid.render().$el);

            // Initialize the paginator
            var paginator = new Backgrid.Extension.Paginator({
                collection: territories
            });

            // Render the paginator
            $gridContainer.append(paginator.render().$el);

        }
    });

    return BackgridView;
});