/**
 * Created by osavch on 29.11.13.
 */

/**
 * Fix under IE8+
 * The toISOString() method returns a string in ISO format (ISO 8601 Extended Format),
 * which can be described as follows: YYYY-MM-DDTHH:mm:ss.sssZ.
 * The timezone is always UTC as denoted by the suffix "Z".
 * This method was standardized in ECMA-262 5th edition.
 * Engines which have not been updated to support this method can work around
 * the absence of this method using the following shim:
 * dateObj.toISOString()
 */
if (!Date.prototype.toISOString) {
    ( function () {

        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }

        Date.prototype.toISOString = function () {
            return this.getUTCFullYear() +
                '-' + pad(this.getUTCMonth() + 1) +
                '-' + pad(this.getUTCDate()) +
                'T' + pad(this.getUTCHours()) +
                ':' + pad(this.getUTCMinutes()) +
                ':' + pad(this.getUTCSeconds()) +
                '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                'Z';
        };

    }() );
}
/**
 * IE<9 doesn't have an .indexOf() function for Array, to define the exact spec version
 * This is the version from MDC, used in Firefox/SpiderMonkey. In other cases such as IE,
 * it'll add .indexOf() in the case it's missing...basically IE8 or below at this point.
 */
if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function(elt /*, from*/)
    {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++)
        {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}