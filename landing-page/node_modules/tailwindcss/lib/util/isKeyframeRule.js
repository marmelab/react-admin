"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>isKeyframeRule
});
function isKeyframeRule(rule) {
    return rule.parent && rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name);
}
