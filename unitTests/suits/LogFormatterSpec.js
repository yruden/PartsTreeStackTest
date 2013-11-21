define(['media/js/LogFormatter' ],function(LogFormatter){
   describe('LogFormatter should', function(){
       var formatter;

       it('set up template property with constructor argument', function(){
           var template = 'template';
           formatter = new LogFormatter(template);
           expect(formatter.template).toBe(template);
       });

       it("constructor should throw error if no parameters passed", function () {
           var formatterCreation = function(){
               formatter = new LogFormatter();
           };
           expect(formatterCreation).toThrow();
       });

       it("format template string with supplied parameters", function () {
           var parameter1 = 1,
               parameter2 = {someProp:'someprop'},
               parameter3 = 'string',
               template = "template {0}{1}{2}",
               expectedResult = "template " + parameter1 + parameter2 + parameter3,
               formatter = new LogFormatter(template),
               formatResult = formatter.format(parameter1, parameter2, parameter3);
           expect(formatResult).toBe(expectedResult);
       });
   });
});

