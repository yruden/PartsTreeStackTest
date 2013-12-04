/**
 * Object.create polyfill.
 * For IE does not accept second parameter with properties object
 */
if (!Object.create) {
    Object.create = (function () {
        function F() {
        }

        return function (o) {
            if (arguments.length != 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o;
            return new F();
        }
    })()
}

/**
 * The function what return
 * class of any object transferred to it
 * @param o - any object
 * @returns {"Null", "Number", "String", "Boolean", "Object", "HTMLLIElement"} type of object
 */
function classof(o) {
    if(o === null) return "Null";
    if(o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);
}