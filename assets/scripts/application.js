
(function () {
    var modules = Window.Framework.Modules;
    var Index = null, Register = null, Login = null;

    modules.LoadModule(["pages/index.js", "pages/login.js", "pages/register.js"], function (modules) {
        // eslint-disable-next-line no-unused-vars
        Index = modules["pages/index.js"].module;
        Register = modules["pages/register.js"].module;
        Login = modules["pages/login.js"].module;


        // Application loaded
        var indexPage = new Index();
        indexPage.render();
    });
})();

