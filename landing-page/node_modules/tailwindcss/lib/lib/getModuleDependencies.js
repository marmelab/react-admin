"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>getModuleDependencies
});
const _fs = /*#__PURE__*/ _interopRequireDefault(require("fs"));
const _path = /*#__PURE__*/ _interopRequireDefault(require("path"));
const _resolve = /*#__PURE__*/ _interopRequireDefault(require("resolve"));
const _detective = /*#__PURE__*/ _interopRequireDefault(require("detective"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function createModule(file) {
    const source = _fs.default.readFileSync(file, "utf-8");
    const requires = (0, _detective.default)(source);
    return {
        file,
        requires
    };
}
function getModuleDependencies(entryFile) {
    const rootModule = createModule(entryFile);
    const modules = [
        rootModule
    ];
    // Iterate over the modules, even when new
    // ones are being added
    for (const mdl of modules){
        mdl.requires.filter((dep)=>{
            // Only track local modules, not node_modules
            return dep.startsWith("./") || dep.startsWith("../");
        }).forEach((dep)=>{
            try {
                const basedir = _path.default.dirname(mdl.file);
                const depPath = _resolve.default.sync(dep, {
                    basedir
                });
                const depModule = createModule(depPath);
                modules.push(depModule);
            } catch (_err) {
            // eslint-disable-next-line no-empty
            }
        });
    }
    return modules;
}
