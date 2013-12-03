define([
    "jQuery",
    "underscore",
    "backbone",
    "src/js/core/EventVent",
    "src/js/events/Event"
], function ($, _, Backbone, EventVent, Event) {
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
                },
                spy = sinon.spy(eventVent, "trigger");
            try{
                eventVent.trigger("eventName");
            }
            catch(e){}
            expect(spy).toHaveThrown("TypeError");
//            expect(triggerEvent(event)).not.toThrow();
//            expect(triggerEvent(eventSuccessor)).not.toThrow();

        });

        it("invoke all handlers for certain event type if this event was published", function(){

        });
    });
});