// @ts-check
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
    loadPostcss: ()=>loadPostcss,
    loadPostcssImport: ()=>loadPostcssImport,
    loadCssNano: ()=>loadCssNano,
    loadAutoprefixer: ()=>loadAutoprefixer
});
const _indexJs = require("../../../peers/index.js");
function loadPostcss() {
    // Try to load a local `postcss` version first
    try {
        return require("postcss");
    } catch  {}
    return (0, _indexJs.lazyPostcss)();
}
function loadPostcssImport() {
    // Try to load a local `postcss-import` version first
    try {
        return require("postcss-import");
    } catch  {}
    return (0, _indexJs.lazyPostcssImport)();
}
function loadCssNano() {
    let options = {
        preset: [
            "default",
            {
                cssDeclarationSorter: false
            }
        ]
    };
    // Try to load a local `cssnano` version first
    try {
        return require("cssnano");
    } catch  {}
    return (0, _indexJs.lazyCssnano)()(options);
}
function loadAutoprefixer() {
    // Try to load a local `autoprefixer` version first
    try {
        return require("autoprefixer");
    } catch  {}
    return (0, _indexJs.lazyAutoprefixer)();
}
