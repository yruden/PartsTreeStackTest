/**
 * Created by osavch on 22.11.13.
 */
define(['src/js/Values' ],function(Values){
    var collection = [4, 2, 8, 6],
        value = new Values(collection);

    describe("Should get minimal value", function(){
        it("The value should be 2", function(){
            var minVal = value.getMin();
            expect(minVal).toBe(2);
        });

        it('Should be be called once', function(){
            expect(value.minVal).toHaveBeenCalledOnce
        })

    });
});