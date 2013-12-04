define([],function(){
    beforeEach(function(){
        this.addMatchers({
            toThrowErrorType:function(expectedType){
                var result = false;
                var exception;
                if (typeof this.actual != 'function') {
                    throw new Error('Actual is not a function');
                }

                if ((typeof expectedType != 'function')) {
                    throw new Error('errorType expected');
                }

                try {
                    this.actual();
                } catch (e) {
                    exception = e;
                }
                if (exception) {
                    result = exception instanceof expectedType;
                }

                var not = this.isNot ? "not " : "";

                this.message = function() {
                    if (exception && !(exception instanceof expectedType)) {
                        return "Expected function " + not + "to throw an exception of certain type";
                    } else {
                        return "Expected function to throw an exception.";
                    }
                };

                return result;
            }
        });
    });
});

