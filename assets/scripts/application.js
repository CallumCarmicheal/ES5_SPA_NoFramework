var modules = Window.Framework.Modules;
var index = null;

(function () {
    modules.LoadModule("pages/index.js", function (module, _index) {
        // Error handling
        if (module.error !== null) {
            console.error("Failed to load index page module!", module);
            return;
        }

        // 
        this.index = _index;
        loaded();
    });

    function loaded() {
        console.log("Loaded!", index);
    }
})();