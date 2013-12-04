define(["underscore", "src/js/events/Event", "src/js/errors/ArgumentNotDefinedError"], function(_, Event, ArgumentNotDefinedError){

    var ventConstructor = function(){
        this.handlers = [];
    };

    ventConstructor.prototype.on = function(eventType, callback){
        if( eventType !== Event && !(eventType.prototype instanceof Event)){
            throw new TypeError('subscribed event is not of Event type or its successor');
        }
        this.handlers.push({eventType:eventType, callback:callback});
    };

//    ventConstructor.prototype.once = function(){
//
//    };

    ventConstructor.prototype.off = function(){

    };

    ventConstructor.prototype.trigger = function(event){
        if(! (event instanceof Event)){
            throw new TypeError('triggered event is not of Event type or its successor');
        }
        var _matchedHandlers = this._filterHandlers(event);
        _.each(_matchedHandlers, function(handler){
            handler.callback.call(this, event);
        });
    };

    ventConstructor.prototype._filterHandlers = function(event){
        var eventFilter = function(handlerItem){ return (event instanceof handlerItem.eventType) };

        return _.filter(this.handlers, function(handler){ return eventFilter(handler)})
    };

    return ventConstructor;
});
