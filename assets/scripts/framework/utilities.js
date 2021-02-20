/**
 * A ES5 version of inline strings. Require a context to be passed
 * @param context any
 * @returns {string}
 */
String.prototype.tmpl = function (context) {
    return this.replace(/\${(.*?)}/g, function (_, code) {
        var scoped = code.replace(/(["'.\w$]+)/g, function (match) {
            return /["']/.test(match[0]) ? match : 'scope.' + match;
        });
        try {
            return new Function('scope', 'return ' + scoped)(context);
        } catch (e) { return ''; }
    });
}

/**
 * Allows you to bind an instance while passing along the this parameter of the current context
 *
 * Intended for use with dom events, setting the instance while being able to keep a reference to
 * a button in an event callback.
 *
 * @param instance
 * @returns {function(): void}
 */
Function.prototype.ibind = function (instance) {
    var fn = this;
    return function() {
        var args = [this]
        for (var idx = 0; idx < arguments.length; idx++)
            args.push(arguments[idx]);

        //console.log({fn: fn, instance:instance, this:this, arguments:arguments, newArgs: args}) ;
        fn.apply(instance, args);
    }
};

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
Window.isFunction = isFunction;