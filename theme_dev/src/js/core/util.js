define([], function(){
   return {
       inherits:function(ctor, superCtor){
           ctor._super = superCtor;
           ctor.prototype = Object.create(superCtor.prototype);
           ctor.prototype.constructor = ctor;
       },
       isBaseType:function(successor, ancestor){
           return successor.prototype instanceof ancestor;
       }
   };
});