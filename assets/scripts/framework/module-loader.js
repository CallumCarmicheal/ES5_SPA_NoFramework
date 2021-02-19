Window.Framework = window.Framework || {};

var ModuleLoader = function ModuleLoader_cctor() {
    this._modules = {};
    this._listeners = {};
    this._failures = {};
    this._requestedPaths = [];

    // Binding
};

ModuleLoader.prototype._getModule = function (path) {
    // Check if the module already failed
    if (path in this._failures) {
        var failure = this._failures[path];
        return { loaded: false, error: failure, module: null };
    }

    // 
    if (path in this._modules) {
        var module = this._modules[path];
        return { loaded: true, error: null, module: module };
    }

    return { loaded: false, error: null, module: null };
};

ModuleLoader.prototype.IsModuleLoaded = function (path) {
    return (path in this._modules);
};

ModuleLoader.prototype.LoadModule = (function (path, callback) {
    this._listeners[path] = this._listeners[path] || [];

    // Check if the module is loaded
    var mod = this._getModule(path);
    if (mod.loaded) {
        callback(mod, mod.module);
        return;
    }

    // Add the callback
    this._listeners[path].push(callback);

    // If we have already requested the path
    if (this._requestedPaths.indexOf(path) > -1) return;

    // Add path to the requested list and then load the script
    this._requestedPaths.push(path);

    //script.onload = function(){};
    var script = document.createElement('script');
    script.src = "assets/scripts/" + path;
    script.setAttribute('fwscript', 'true');
    document.head.appendChild(script);
});

ModuleLoader.prototype.RegisterModule = (function (path, module) {
    if (module === undefined || module == null) return;

    this._modules[path] = module;

    if (path in this._listeners) {
        var mod = this._getModule(path);

        for (var index = 0; index < this._listeners[path].length; index++) {
            var callback = this._listeners[path][index];
            callback(mod, mod.module);
        }
    }
});

Window.Framework.Modules = new ModuleLoader();