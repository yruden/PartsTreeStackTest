define([], function () {
    var errorConstructor = function(argumentName){
        Error.apply(this);
        this.message = ["obligatory argument", argumentName, "is not defined"].join(" ");
    };
    errorConstructor.prototype = Object.create(Error.prototype);
    errorConstructor.prototype.name = "ArgumentNotDefinedError";
    errorConstructor.prototype.constructor = errorConstructor;
    return errorConstructor;
});
