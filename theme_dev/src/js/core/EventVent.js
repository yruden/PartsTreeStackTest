define(["underscore", "src/js/events/Event", "src/js/errors/ArgumentNotDefinedError"], function(_, Event, ArgumentNotDefinedError){
    var ventConstructor = function(){
        this.events = [];
    };

    ventConstructor.prototype.on = function(){

    };

    ventConstructor.prototype.once = function(){

    };

    ventConstructor.prototype.off = function(){

    };

    ventConstructor.prototype.trigger = function(eventType){
        if(! (eventType instanceof Event)){
            throw new TypeError('triggered event is not of Event type or its successor');
        }
    };

    return ventConstructor;
});
