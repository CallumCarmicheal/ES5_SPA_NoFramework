declare global {

    interface ModuleLoader {
        RegisterModule: (path: String, module: any) => void;
    };


    interface Framework {
        Modules: ModuleLoader;
    };


    interface Window { Framework: Framework; }
}