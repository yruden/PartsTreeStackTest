define(['underscore'], function (_) {
    var parameterRegExp = /{(\d+)}/g,
        Formatter = function (template) {
            if (!template) throw new Error('template error should be supplied');
            this.template = template;
        }

    Formatter.prototype.format = function () {
        var args = arguments;
        return this.template.replace(parameterRegExp, function (token, number) {
            return args[number] + '';
        });
    }

    return Formatter;
});
