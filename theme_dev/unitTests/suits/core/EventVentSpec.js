define([
    "jQuery",
    "underscore",
    "backbone",
    "src/js/core/EventVent",
    "src/js/events/Event",
    "unitTests/CustomJasmineMatchers/CustomJasmineMatchers"
], function ($, _, Backbone, EventVent, Event) {
    var util = {
        inherits:function(ctor, superCtor){
            ctor._super = superCtor;
            ctor.prototype = Object.create(superCtor.prototype);
            ctor.prototype.constructor = ctor;
        }
    };

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
                        eventVent.on(eventType);
                    }
                };
            util.inherits(EventSuccessorType, Event);

            expect(subscribeEvent(function(){})).toThrowErrorType(TypeError);
            expect(subscribeEvent(Event)).not.toThrow();
            expect(subscribeEvent(EventSuccessorType)).not.toThrow();
        });

        xit("invoke all handlers subscribed for certain event type when event of this type was published", function(){
            var FirstEventType = function(){},
                SecondEventType = function(){},
                firstEventCallback1 = sinon.spy(),
                firstEventCallback2 = sinon.spy(),
                secondEventCallback = sinon.spy();
            util.inherits(FirstEventType, Event);
            util.inherits(SecondEventType, Event);
            eventVent.on(FirstEventType, firstEventCallback1);
            eventVent.on(FirstEventType, firstEventCallback2);
            eventVent.on(SecondEventType, secondEventCallback);

            eventVent.trigger(new FirstEventType());

            expect(firstEventCallback1).toHaveBeenCalledOnce();
            expect(firstEventCallback2).toHaveBeenCalledOnce();
            expect(secondEventCallback.callCount).toBe(0);
        });

        xit("pass event object into invoked event handler", function(){
            var FirstEventType = function(){},
                firstEventCallback = sinon.spy();
            util.inherits(FirstEventType, Event);
            var firstEvent = new FirstEventType();
            eventVent.on(FirstEventType, firstEventCallback);

            eventVent.trigger(firstEvent);

            expect(firstEventCallback).toHaveBeenCalledWithExactly(firstEvent)
        });

//        it("call event handler with context provided in subscription", function(){
//            var FirstEventType = function(){},
//                firstEventCallback = sinon.spy();
//            util.inherits(FirstEventType, Event);
//            var firstEvent = new FirstEventType();
//            eventVent.on(FirstEventType, firstEventCallback);
//
//            eventVent.trigger(firstEvent);
//
//            expect(firstEventCallback).toHaveBeenCalledWithExactly(firstEvent)
//        });


    });
});