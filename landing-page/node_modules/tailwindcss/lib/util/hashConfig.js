"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>hashConfig
});
const _objectHash = /*#__PURE__*/ _interopRequireDefault(require("object-hash"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function hashConfig(config) {
    return (0, _objectHash.default)(config, {
        ignoreUnknown: true
    });
}
