///**
// * Created by osavch on 26.11.13.
// */
//define(["jQuery", "underscore", "backbone", "src/js/routers/MainRoute"], function ($, _, Backbone, MainRoute) {
//    describe("Main route", function(){
//        beforeEach(function(){
//            // Create a mock version of our router by extending it and only overriding
//            // the methods
//            var mockRouter = MainRoute.extend({
//                index: function() {},
//                login: function() {},
//                logoff: function() {}
//            });
//            // Set up a spy and invoke the router
//            this.routeSpy = sinon.spy();
//            this.router = new mockRouter;
//
//            // Prevent history.start from throwing error
//            try {
//                Backbone.history.start({silent:true, pushState:true});
//            } catch(e) {
//                alert(new Error(e));
//            }
//
//            // Reset URL
//            this.router.navigate("tests/SpecRunner.html");
//        });
//        afterEach(function(){
//            // Reset URL
//            this.router.navigate("tests/SpecRunner.html");
//        });
//        it('Has the right amount of routes', function() {
//            expect(_.size(this.router.routes)).toEqual(2);
//        });
//
//        it('/ -route exists and points to the right method', function () {
//            expect(this.router.routes['']).toEqual('index');
//        });
//
//        it("Can navigate to /", function() {
//            this.router.bind("route:index", this.routeSpy);
//            this.router.navigate("", true);
//            expect(this.routeSpy.calledOnce).toBeTruthy();
//            expect(this.routeSpy.calledWith()).toBeTruthy();
//        });
//
//    });
//});