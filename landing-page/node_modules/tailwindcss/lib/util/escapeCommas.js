"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>escapeCommas
});
function escapeCommas(className) {
    return className.replace(/\\,/g, "\\2c ");
}
