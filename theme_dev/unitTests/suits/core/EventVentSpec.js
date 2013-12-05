define([
    "jQuery",
    "underscore",
    "backbone",
    "src/js/core/EventVent",
    "src/js/events/Event",
    "src/js/core/util",
    "unitTests/CustomJasmineMatchers/CustomJasmineMatchers"
], function ($, _, Backbone, EventVent, Event, util) {

    var FirstEventType = function(){},
        SecondEventType = function(){};
    util.inherits(FirstEventType, Event);
    util.inherits(SecondEventType, Event);

    describe("EventVentSpec.js spec: EventVent should", function () {
        var eventVent;

        beforeEach(function(){
            eventVent = new EventVent();
        });

        it("throw if published object is not Event object or it`s successor", function(){
            var event = new Event(),
                eventSuccessor = Object.create(Event.prototype),
                triggerEvent = function(eventArg){
                    return function(){
                        eventVent.trigger(eventArg);
                    }
                };
            expect(triggerEvent('eventName')).toThrowErrorType(TypeError);
            expect(triggerEvent(event)).not.toThrow();
            expect(triggerEvent(eventSuccessor)).not.toThrow();
        });

        it("throw if subscribed event type is not Event or it`s successor", function(){
            var EventSuccessorType = function(){},
                subscribeEvent = function(eventType){
                    return function(){
                        eventVent.on(eventType, function(){});
                    }
                };
            util.inherits(EventSuccessorType, Event);

            expect(subscribeEvent(function(){})).toThrowErrorType(TypeError);
            expect(subscribeEvent(Event)).not.toThrow();
            expect(subscribeEvent(EventSuccessorType)).not.toThrow();
        });

        it("throw if callback was not supplied on event subscription", function(){
            var subscribeEvent = function(callback){
                    return function(){
                        eventVent.on(Event, callback);
                    }
                };

            expect(subscribeEvent()).toThrowErrorType(TypeError);
            expect(subscribeEvent(function(){})).not.toThrow();
        });

        it("invoke all handlers subscribed for certain event type when event of this type was published", function(){
            var firstEventCallback1 = sinon.spy(),
                firstEventCallback2 = sinon.spy(),
                secondEventCallback = sinon.spy();
            eventVent.on(FirstEventType, firstEventCallback1);
            eventVent.on(FirstEventType, firstEventCallback2);
            eventVent.on(SecondEventType, secondEventCallback);

            eventVent.trigger(new FirstEventType());

            expect(firstEventCallback1).toHaveBeenCalledOnce();
            expect(firstEventCallback2).toHaveBeenCalledOnce();
            expect(secondEventCallback).not.toHaveBeenCalled();
        });

        it("invoke handler subscribed on Event class event, on each event published", function(){
            var eventCallback = sinon.spy();
            eventVent.on(Event, eventCallback);

            eventVent.trigger(new Event());
            eventVent.trigger(new FirstEventType());
            eventVent.trigger(new SecondEventType());

            expect(eventCallback).toHaveBeenCalledThrice()
        });

        it("pass event object into invoked event handler", function(){
            var firstEventCallback = sinon.spy(),
                firstEvent = new FirstEventType();
            eventVent.on(FirstEventType, firstEventCallback);

            eventVent.trigger(firstEvent);

            expect(firstEventCallback).toHaveBeenCalledWithExactly(firstEvent)
        });

        it("invoke event handler with context provided in subscription", function(){
            var eventCallback = sinon.spy(),
                context = {};
            eventVent.on(Event, eventCallback, context);

            eventVent.trigger(new Event());

            expect(eventCallback).toHaveBeenCalledOn(context);
        });

        it("invoke event handler with eventVent instance as a context, if no context provided on subscription", function(){
            var eventCallback = sinon.spy();
            eventVent.on(Event, eventCallback);

            eventVent.trigger(new Event());

            expect(eventCallback).toHaveBeenCalledOn(eventVent);
        });

        it("unsubscribe certian handler", function(){
            var eventCallback1 = sinon.spy(),
                eventCallback2 = sinon.spy();
            eventVent.on(Event, eventCallback1);
            eventVent.on(Event, eventCallback2);
            eventVent.trigger(new Event());

            expect(eventCallback1).toHaveBeenCalledOnce();
            expect(eventCallback2).toHaveBeenCalledOnce();

            eventVent.off(null, eventCallback1);
            eventVent.trigger(new Event());

            expect(eventCallback1).toHaveBeenCalledOnce();
            expect(eventCallback2).toHaveBeenCalledTwice();
        });

        it("unsubscribe all handlers for event type", function(){
            var firstEventhandler1 = sinon.spy(),
                firstEventHandler2 = sinon.spy(),
                secondEventhandler = sinon.spy();
            eventVent.on(FirstEventType, firstEventhandler1);
            eventVent.on(FirstEventType, firstEventHandler2);
            eventVent.on(SecondEventType, secondEventhandler);
            eventVent.off(FirstEventType);

            eventVent.trigger(new FirstEventType());
            eventVent.trigger(new SecondEventType());

            expect(firstEventhandler1).not.toHaveBeenCalled();
            expect(firstEventHandler2).not.toHaveBeenCalled();
            expect(secondEventhandler).toHaveBeenCalledOnce();
        });

        it("unsubscribe all handlers with certain context", function(){
            var eventHandler1 = sinon.spy(),
                eventHandler2 = sinon.spy(),
                eventHandler3 = sinon.spy(),
                context1 =  { "context1":true },
                context2 = { "context2":true };
            eventVent.on(Event, eventHandler1, context1);
            eventVent.on(Event, eventHandler2, context1);
            eventVent.on(Event, eventHandler3, context2);
            eventVent.off(null, null, context1);

            eventVent.trigger(new Event());

            expect(eventHandler1).not.toHaveBeenCalled();
            expect(eventHandler2).not.toHaveBeenCalled();
            expect(eventHandler3).toHaveBeenCalledOnce();
        });

        it("unsubscribe all handlers on off call without parameters", function(){
            var eventHandler1 = sinon.spy(),
                eventHandler2 = sinon.spy();
            eventVent.on(Event, eventHandler1);
            eventVent.on(Event, eventHandler2);
            eventVent.off();

            eventVent.trigger(new Event());

            expect(eventHandler1).not.toHaveBeenCalled();
            expect(eventHandler2).not.toHaveBeenCalled();
        });

    });
});