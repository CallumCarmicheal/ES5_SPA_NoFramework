(function() {
    var isFunction = Window.isFunction;

    var Element = (function () {
        this.elem = null;
        this.ids = {};

        this.getHtml = function() {
            return '<div> Element not implemented </div>';
        };

        this.render = function() {
            if (this.elem == null)
                this.elem = document.createElement('div');

            this.elem.innerHTML = this.getHtml();

            this.parseElementDom();

            var $app = $('#app');
            $app.empty();
            $app.append(this.elem);
        };

        this.parseElementDom = function() {
            var $elem = $(this.element);

            $elem.find("[data-bind]").each((function(index, element) {
                var $elem = $(element);
                var attr = element.getAttribute("data-bind").trim();
                // Remove the surrounding []
                attr = attr.substring(attr[0] === '[' ? 1 : 0, attr[attr.length-1] === ']' ? attr.length - 1 : attr.length);

                // Group the event and function name
                var split = attr.split(', ');
                for(var idx = 0; idx < split.length; idx++) {
                    var itm = split[idx].split(':');
                    var evt = itm[0].trim(), fn = itm[1].trim();

                    // Check if the function exists
                    if (isFunction(this[fn])) {
                        // TODO: Check if this work as both functions will be unique instances
                        var cbFn = this[fn].ibind(this);
                        $elem.off(evt, cbFn);
                        $elem.on(evt, cbFn);
                    } else {
                        console.error("Failed to bind event because method was not found: ", {event: evt, method: fn});
                    }
                }
            }).bind(this));

            $elem.find("[data-id]").each((function(index, element) {
                var id = element.getAttribute('data-id');
                this.ids[id] = element;
            }).bind(this))
        };
    });

    Window.Framework.Modules.RegisterModule('framework/element.js', Element);
})();