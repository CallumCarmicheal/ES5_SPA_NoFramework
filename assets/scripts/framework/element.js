(function() {
    var isFunction = Window.isFunction;

    var Element = (function () {
        var _variables = this.g_Variables = {};

        this.elem = null;
        this.ids = {};

        this.state = function(name, useHtml, defaultValue) {
            _variables[name] = _variables[name] || {useHtml: useHtml, elements: [], value: defaultValue};

            Object.defineProperty( this, name, {
                get: function ( ) {
                    var v = _variables[name]
                    return v.value
                },
                set: function (val) {
                    var v = _variables[name];
                    v.value = val;

                    if (v.elements.length > 0) {
                        for(var idx = 0; idx < v.elements.length; idx++) {
                            var itm = v.elements[idx];

                            if (itm.element.childElementCount > 0) {
                                console.debug("We have more then 1 child!",
                                    {this:this, name:name, v:v, childElemCount:itm.element.childElementCount});
                                debugger;
                            }
                            else {
                                if (v.useHtml) {
                                    itm.element.innerHTML = isFunction(itm.format) ? itm.format(v.value) : v.value;
                                } else {
                                    itm.element.innerText = isFunction(itm.format) ? itm.format(v.value) : v.value;
                                }
                            }
                        }
                    }
                }
            });
        };


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

            this.loaded();
        };

        this.parseElementDom = function() {
            var $elem = $(this.elem);

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

            var regExpVariable = /\$\([a-zA-Z0-9_]*\)/;

            var searchElements = (function(host) {
                $(host.children).filter(function() {
                    // Regex for $(***)
                    return regExpVariable.test(this.innerText);
                }).each(function(index, element){
                    if (element.childElementCount > 0) {
                        searchElements(element);
                        return;
                    }

                    // TODO: Rewrite this to allow for multiple variables in the same object next to each other
                    var matches = regExpVariable.exec(element.innerHTML);
                    console.log(matches);

                    if(matches.length > 1) {
                        console.error("more then 1 variable in object!");
                        debugger;
                    }

                    // Do a basic hack
                    var name = matches[0].substring(2, matches[0].length-1);
                    _variables[name] = _variables[name] || {useHtml: false, elements: [], value: null};

                    var parts = [];
                    if (_variables[name].useHtml) {
                        var splitHtml = element.innerHTML.split(matches[0])
                        parts = [splitHtml[0], splitHtml[1]];

                        element.innerHTML = parts[0] + _variables[name].value + parts[1]
                    }
                    else {
                        var splitText = element.innerText.split(matches[0])
                        parts = [splitText[0], splitText[1]];

                        element.innerText = parts[0] + _variables[name].value + parts[1]
                    }

                    _variables[name].elements.push({
                        element: element,
                        format: function(value) {
                            return parts[0] + value + parts[1];
                        }
                    });
                }.bind(this));
            }).bind(this);
            searchElements($elem[0]);
        };

        this.loaded = function() { /* */ };
    });

    Window.Framework.Modules.RegisterModule('framework/element.js', Element);
})();