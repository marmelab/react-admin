// @ts-check
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "init", {
    enumerable: true,
    get: ()=>init
});
const _fs = /*#__PURE__*/ _interopRequireDefault(require("fs"));
const _path = /*#__PURE__*/ _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function init(args, configs) {
    let messages = [];
    var _args___;
    let tailwindConfigLocation = _path.default.resolve((_args___ = args["_"][1]) !== null && _args___ !== void 0 ? _args___ : `./${configs.tailwind}`);
    if (_fs.default.existsSync(tailwindConfigLocation)) {
        messages.push(`${_path.default.basename(tailwindConfigLocation)} already exists.`);
    } else {
        let stubFile = _fs.default.readFileSync(args["--full"] ? _path.default.resolve(__dirname, "../../../stubs/defaultConfig.stub.js") : _path.default.resolve(__dirname, "../../../stubs/simpleConfig.stub.js"), "utf8");
        // Change colors import
        stubFile = stubFile.replace("../colors", "tailwindcss/colors");
        _fs.default.writeFileSync(tailwindConfigLocation, stubFile, "utf8");
        messages.push(`Created Tailwind CSS config file: ${_path.default.basename(tailwindConfigLocation)}`);
    }
    if (args["--postcss"]) {
        let postcssConfigLocation = _path.default.resolve(`./${configs.postcss}`);
        if (_fs.default.existsSync(postcssConfigLocation)) {
            messages.push(`${_path.default.basename(postcssConfigLocation)} already exists.`);
        } else {
            let stubFile1 = _fs.default.readFileSync(_path.default.resolve(__dirname, "../../../stubs/defaultPostCssConfig.stub.js"), "utf8");
            _fs.default.writeFileSync(postcssConfigLocation, stubFile1, "utf8");
            messages.push(`Created PostCSS config file: ${_path.default.basename(postcssConfigLocation)}`);
        }
    }
    if (messages.length > 0) {
        console.log();
        for (let message of messages){
            console.log(message);
        }
    }
}
