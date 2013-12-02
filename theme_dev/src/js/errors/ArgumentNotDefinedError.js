define([], function () {
    var errorConstructor = function(argumentName){
        this.message = ["obligatory argument", argumentName, "is not defined"].join(" ");
        Error.apply(this);
    };
    errorConstructor.prototype = Object.create(Error.prototype);
    errorConstructor.prototype.constructor = errorConstructor;
    return errorConstructor;
});
