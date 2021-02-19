'use strict';
Window.Framework = window.Framework || {};

var ModuleLoader = function () {
    //
    // Private Variables
    // =====================================

    var _modules = {};
    var _listeners = {};
    var _failures = {};
    var _requestedPaths = [];

    //
    // Private methods
    // =====================================

    var loadModule_Array = function (modules, callback) {
        var loadedModules = {};

        for (var idx = 0; idx < modules.length; idx++) {
            var path = modules[idx];

            // eslint-disable-next-line no-unused-vars
            loadModule_Single(path, function (module, obj) {
                loadedModules[module.path] = module;

                // We have loaded all the modules
                if (Object.keys(loadedModules).length == modules.length) {
                    callback(loadedModules);
                }
            });
        }
    };

    var loadModule_Single = (function (path, callback) {
        _listeners[path] = _listeners[path] || [];

        // Check if the module is loaded
        var mod = getModule(path);
        if (mod.attempted) {
            callback(mod, mod.module);
            return;
        }

        // Add the callback
        _listeners[path].push(callback);

        // If we have already requested the path
        if (_requestedPaths.indexOf(path) > -1) return;

        // Add path to the requested list and then load the script
        _requestedPaths.push(path);

        // Handle any errors
        var errorFn = (function (jqXMLHttpRequest, textStatus, errorThrown) {
            this._failures[path] = { 'jqXMLHttpRequest': jqXMLHttpRequest, 'textStatus': textStatus, 'errorThrown': errorThrown };
            var moduleResponse = getModule(path);
            callback(moduleResponse, null);
        }).bind(this);

        // Do an AJAX request, This will solve any errors when the 
        // requested file path is invalid.
        $.ajax({
            type: "GET",
            url: "assets/scripts/" + path,
            async: false,

            // textStatus: "success", "notmodified", "nocontent", "error", "timeout", "abort", or "parsererror"
            success: function (data, textStatus, jqXMLHttpRequest) {

                // Load the script if the request was valid
                if (textStatus == "success") {
                    var scriptElement = document.createElement('script');
                    scriptElement.type = 'text/javascript';

                    try {
                        scriptElement.appendChild(document.createTextNode(data));
                        document.body.appendChild(scriptElement);
                    } catch (e) {
                        scriptElement.text = data;
                        document.body.appendChild(scriptElement);
                    }
                } else {
                    errorFn(jqXMLHttpRequest, textStatus, null);
                }
            },
            error: errorFn
        });
    });

    var getModule = function (path) {
        // Check if the module already failed
        if (path in _failures) {
            var failure = _failures[path];
            return { attempted: true, loaded: false, path: path, error: failure, module: null };
        }

        // Check if the module is already loaded
        if (path in _modules) {
            var module = _modules[path];
            return { attempted: true, loaded: true, path: path, error: null, module: module };
        }

        return { attempted: false, loaded: false, path: path, error: null, module: null };
    };

    //
    // Public functions
    // =====================================

    this.LoadModule = function (pathlist_or_path, callback) {
        if (Array.isArray(pathlist_or_path))
            return loadModule_Array(pathlist_or_path, callback);

        return loadModule_Single(pathlist_or_path, callback);
    };

    this.IsModuleLoaded = function (path) {
        return (path in _modules);
    };

    this.RegisterModule = function (path, module) {
        if (module === undefined || module == null) return;

        _modules[path] = module;

        if (path in _listeners) {
            var mod = getModule(path);

            for (var index = 0; index < _listeners[path].length; index++) {
                var callback = _listeners[path][index];
                callback(mod, mod.module);
            }
        }
    };
};


Window.Framework.Modules = new ModuleLoader();