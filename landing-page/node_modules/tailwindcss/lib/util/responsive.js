"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>responsive
});
const _postcss = /*#__PURE__*/ _interopRequireDefault(require("postcss"));
const _cloneNodes = /*#__PURE__*/ _interopRequireDefault(require("./cloneNodes"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function responsive(rules) {
    return _postcss.default.atRule({
        name: "responsive"
    }).append((0, _cloneNodes.default)(Array.isArray(rules) ? rules : [
        rules
    ]));
}
