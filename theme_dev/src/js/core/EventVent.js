define([
    "underscore",
    "src/js/events/Event",
    "src/js/errors/ArgumentNotDefinedError",
    "src/js/core/util"
], function(_, Event, ArgumentNotDefinedError, util){

    var ventConstructor = function(){
        this.handlers = [];
    };

    ventConstructor.prototype.on = function(eventType, callback, context){
        if(eventType !== Event && !util.isBaseType(eventType, Event)){
            throw new TypeError("subscribed event type is not of Event one or its successor");
        }
        if(!_.isFunction(callback)){
            throw new TypeError("callback should be provided for event subscription")
        }
        this.handlers.push({eventType:eventType, callback:callback, context:context || this});
    };

    ventConstructor.prototype.off = function(eventType, callback, context){
        var offHandlers = this._filterHandlers(eventType, callback, context)
        this.handlers = _.difference(this.handlers, offHandlers);
    };

    ventConstructor.prototype.trigger = function(event){
        if(! (event instanceof Event)){
            throw new TypeError("triggered event is not of Event type or its successor");
        }
        var _matchedHandlers = _.filter(this.handlers, function(handlerItem){
            return (event instanceof handlerItem.eventType)
        });
        _.each(_matchedHandlers, function(handler){
            handler.callback.call(handler.context, event);
        });
    };

    ventConstructor.prototype._filterHandlers = function(eventType, callback, context){
        var eventTypeFilter = eventType
                                ? function(handler){
                                    var handlerType = handler.eventType;
                                    return handlerType === eventType || util.isBaseType(handlerType, eventType);
                                  }
                                : function(){ return true; };
        var callbackFilter = callback
                                ? function(handler){ return handler.callback === callback; }
                                : function(){ return true; };
        var contextFilter = context
                                ? function(handler){ return handler.context === context}
                                : function(){ return true; };

        return _.filter(this.handlers, function(handler){
            return eventTypeFilter(handler) && callbackFilter(handler) && contextFilter(handler);
        })
    };

    return ventConstructor;
});
