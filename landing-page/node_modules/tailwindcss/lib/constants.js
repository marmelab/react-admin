"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    cli: ()=>cli,
    defaultConfigFile: ()=>defaultConfigFile,
    defaultPostCssConfigFile: ()=>defaultPostCssConfigFile,
    cjsConfigFile: ()=>cjsConfigFile,
    cjsPostCssConfigFile: ()=>cjsPostCssConfigFile,
    supportedConfigFiles: ()=>supportedConfigFiles,
    supportedPostCssConfigFile: ()=>supportedPostCssConfigFile,
    defaultConfigStubFile: ()=>defaultConfigStubFile,
    simpleConfigStubFile: ()=>simpleConfigStubFile,
    defaultPostCssConfigStubFile: ()=>defaultPostCssConfigStubFile
});
const _path = /*#__PURE__*/ _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const cli = "tailwind";
const defaultConfigFile = "./tailwind.config.js";
const defaultPostCssConfigFile = "./postcss.config.js";
const cjsConfigFile = "./tailwind.config.cjs";
const cjsPostCssConfigFile = "./postcss.config.cjs";
const supportedConfigFiles = [
    cjsConfigFile,
    defaultConfigFile
];
const supportedPostCssConfigFile = [
    cjsPostCssConfigFile,
    defaultPostCssConfigFile
];
const defaultConfigStubFile = _path.default.resolve(__dirname, "../stubs/defaultConfig.stub.js");
const simpleConfigStubFile = _path.default.resolve(__dirname, "../stubs/simpleConfig.stub.js");
const defaultPostCssConfigStubFile = _path.default.resolve(__dirname, "../stubs/defaultPostCssConfig.stub.js");
