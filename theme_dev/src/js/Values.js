/**
 * Created by osavch on 22.11.13.
 */
define(['underscore'],function(_){
    var minVal = function(collection){
        this.collection = collection;
    };

    minVal.prototype.getMin = function(){
        return _.min(this.collection);
    };

    return minVal;
});