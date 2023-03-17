"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>escapeClassName
});
const _postcssSelectorParser = /*#__PURE__*/ _interopRequireDefault(require("postcss-selector-parser"));
const _escapeCommas = /*#__PURE__*/ _interopRequireDefault(require("./escapeCommas"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function escapeClassName(className) {
    var _node_raws;
    let node = _postcssSelectorParser.default.className();
    node.value = className;
    var _node_raws_value;
    return (0, _escapeCommas.default)((_node_raws_value = node === null || node === void 0 ? void 0 : (_node_raws = node.raws) === null || _node_raws === void 0 ? void 0 : _node_raws.value) !== null && _node_raws_value !== void 0 ? _node_raws_value : node.value);
}
