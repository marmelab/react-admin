"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    lazyPostcss: ()=>lazyPostcss,
    lazyPostcssImport: ()=>lazyPostcssImport,
    lazyAutoprefixer: ()=>lazyAutoprefixer,
    lazyCssnano: ()=>lazyCssnano
});
function lazyPostcss() {
    return require("postcss");
}
function lazyPostcssImport() {
    return require("postcss-import");
}
function lazyAutoprefixer() {
    return require("autoprefixer");
}
function lazyCssnano() {
    return require("cssnano");
}
