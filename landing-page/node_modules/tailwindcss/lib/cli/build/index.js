// @ts-check
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "build", {
    enumerable: true,
    get: ()=>build
});
const _fs = /*#__PURE__*/ _interopRequireDefault(require("fs"));
const _path = /*#__PURE__*/ _interopRequireDefault(require("path"));
const _pluginJs = require("./plugin.js");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function build(args, configs) {
    let input = args["--input"];
    let shouldWatch = args["--watch"];
    // TODO: Deprecate this in future versions
    if (!input && args["_"][1]) {
        console.error("[deprecation] Running tailwindcss without -i, please provide an input file.");
        input = args["--input"] = args["_"][1];
    }
    if (input && input !== "-" && !_fs.default.existsSync(input = _path.default.resolve(input))) {
        console.error(`Specified input file ${args["--input"]} does not exist.`);
        process.exit(9);
    }
    if (args["--config"] && !_fs.default.existsSync(args["--config"] = _path.default.resolve(args["--config"]))) {
        console.error(`Specified config file ${args["--config"]} does not exist.`);
        process.exit(9);
    }
    // TODO: Reference the @config path here if exists
    let configPath = args["--config"] ? args["--config"] : ((defaultPath)=>_fs.default.existsSync(defaultPath) ? defaultPath : null)(_path.default.resolve(`./${configs.tailwind}`));
    let processor = await (0, _pluginJs.createProcessor)(args, configPath);
    if (shouldWatch) {
        // Abort the watcher if stdin is closed to avoid zombie processes
        // You can disable this behavior with --watch=always
        if (args["--watch"] !== "always") {
            process.stdin.on("end", ()=>process.exit(0));
        }
        process.stdin.resume();
        await processor.watch();
    } else {
        await processor.build();
    }
}
