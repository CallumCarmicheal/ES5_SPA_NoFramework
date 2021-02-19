var modules = Window.Framework.Modules;
var index = null, register = null, login = null;

(function () {
    modules.LoadModule(["pages/index.js", "pages/login.js", "pages/register.js"], function (modules) {
        index = modules["pages/index.js"].module;
        register = modules["pages/register.js"].module;
        login = modules["pages/login.js"].module;

        loaded();
    });

    function loaded() {
        console.log("Everything loaded event!", { index: index, register: register, login: login });
    }
})();

