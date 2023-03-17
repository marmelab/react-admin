"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * @template {string | import('postcss-selector-parser').Root} T
 *
 * Prefix all classes in the selector with the given prefix
 *
 * It can take either a string or a selector AST and will return the same type
 *
 * @param {string} prefix
 * @param {T} selector
 * @param {boolean} prependNegative
 * @returns {T}
 */ "default", {
    enumerable: true,
    get: ()=>_default
});
const _postcssSelectorParser = /*#__PURE__*/ _interopRequireDefault(require("postcss-selector-parser"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _default(prefix, selector, prependNegative = false) {
    if (prefix === "") {
        return selector;
    }
    let ast = typeof selector === "string" ? (0, _postcssSelectorParser.default)().astSync(selector) : selector;
    ast.walkClasses((classSelector)=>{
        let baseClass = classSelector.value;
        let shouldPlaceNegativeBeforePrefix = prependNegative && baseClass.startsWith("-");
        classSelector.value = shouldPlaceNegativeBeforePrefix ? `-${prefix}${baseClass.slice(1)}` : `${prefix}${baseClass}`;
    });
    return typeof selector === "string" ? ast.toString() : ast;
}
