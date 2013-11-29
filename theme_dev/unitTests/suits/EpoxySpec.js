/**
* Created by osavch on 22.11.13.
*/
define(["jQuery", "underscore", "backbone", "src/js/BindModel"],function($, _, Backbone, bindModel){

    describe("A bind Model", function(){
        it('Should get firstName', function(){
            expect(bindModel.get('firstName')).toBe('Luke');
        });
        it('Should get lastName', function(){
            expect(bindModel.get('lastName')).toBe('Skywalker');
        });
    });
});