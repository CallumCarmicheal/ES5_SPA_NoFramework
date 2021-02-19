'use strict';
Window.Framework = window.Framework || {};



var ModuleLoader = function ModuleLoader_cctor() {
    this._modules = {};
    this._listeners = {};
};


ModuleLoader.prototype.LoadModule = function (modules, callback) {
    var newCallback = function (modules) {

    };



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

Window.Framework.ModulesNew = new ModuleLoader();