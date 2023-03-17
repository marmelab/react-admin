"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _cloneDeep = require("../util/cloneDeep");
const _defaultConfigStub = /*#__PURE__*/ _interopRequireDefault(require("../../stubs/defaultConfig.stub"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = (0, _cloneDeep.cloneDeep)(_defaultConfigStub.default);
