define([], function () {
    var errorConstructor = function(argumentName){
        Error.apply(this);
        this.message = ["obligatory argument", argumentName, "is not defined"].join(" ");
        this.name = "ArgumentNotDefinedError";
    };
    errorConstructor.prototype = Object.create(Error.prototype);
    errorConstructor.prototype.constructor = errorConstructor;
    return errorConstructor;
});
