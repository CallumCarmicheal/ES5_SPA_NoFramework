(function () {
    var isFunction = Window.isFunction; // es lint could not find this function for some reason

    Window.Framework.Modules.LoadModule('framework/element.js', function(mod, Element) {
        // https://eli.thegreenplace.net/2013/10/22/classical-inheritance-in-javascript-es5
        function IndexPage() {
            Element.call(this); // base();

            var incr = 0;

            this.getHtml = function() {
                return '\
                   <button class="btn btn-primary" data-bind="[click: btnIncr_Click]"> Click </button>\
                   <p> Auto update = $(increment), Not done yet </p>\
                   <p> Triggered update = <span data-id="incr" /></p>';
            };

            this.btnIncr_Click = function(sender, event) {
                this.ids['incr'].innerHTML = "" + (++ incr);
            };
        }

        // Circle derives from Shape
        IndexPage.prototype = Object.create(Element.prototype);
        IndexPage.prototype.constructor = IndexPage;

        Window.Framework.Modules.RegisterModule('pages/index.js', IndexPage);
    });

    /*
    function index() {
        var increment = 0;
        var element = null;
        var $elements = {};

        this.render = function () {
            if (element !== null) {
                // TODO: Handle reloading
                return;
            }

            element = document.createElement('div');

            // TODO: Auto incrementing
            var html = '\
                <button class="btn btn-primary" data-bind="[click: btnIncr_Click]"> Click </button>\
                <p> Auto update = $(increment), Not done yet </p>\
                <p> Auto update = <span data-id="incr" /></p>'

            element.innerHTML = html;

            $(element).find("[data-bind]")
                .each((function(index, element) {
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

            $(element).find("[data-id]")
                .each((function(index, element) {
                    var id = element.getAttribute('data-id');
                    $elements[id] = element;
                }).bind(this))

            var $app = $('#app');
            $app.empty();
            $app.append(element);
        }

        this.btnIncr_Click = function (sender, event) {
            increment++;
            $elements["incr"].innerHTML = "" + increment;
        };
    }

    /**/
})();