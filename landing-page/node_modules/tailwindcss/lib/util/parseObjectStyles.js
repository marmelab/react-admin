"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>parseObjectStyles
});
const _postcss = /*#__PURE__*/ _interopRequireDefault(require("postcss"));
const _postcssNested = /*#__PURE__*/ _interopRequireDefault(require("postcss-nested"));
const _postcssJs = /*#__PURE__*/ _interopRequireDefault(require("postcss-js"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function parseObjectStyles(styles) {
    if (!Array.isArray(styles)) {
        return parseObjectStyles([
            styles
        ]);
    }
    return styles.flatMap((style)=>{
        return (0, _postcss.default)([
            (0, _postcssNested.default)({
                bubble: [
                    "screen"
                ]
            })
        ]).process(style, {
            parser: _postcssJs.default
        }).root.nodes;
    });
}
