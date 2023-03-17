"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateConfig", {
    enumerable: true,
    get: ()=>validateConfig
});
const _log = /*#__PURE__*/ _interopRequireDefault(require("./log"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function validateConfig(config) {
    if (config.content.files.length === 0) {
        _log.default.warn("content-problems", [
            "The `content` option in your Tailwind CSS configuration is missing or empty.",
            "Configure your content sources or your generated CSS will be missing styles.",
            "https://tailwindcss.com/docs/content-configuration"
        ]);
    }
    return config;
}
