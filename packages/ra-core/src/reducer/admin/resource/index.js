"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../../../actions");
var data_1 = __importDefault(require("./data"));
var list_1 = __importDefault(require("./list"));
var initialState = {};
exports.default = (function (previousState, action) {
    if (previousState === void 0) { previousState = initialState; }
    var _a;
    if (action.type === actions_1.REGISTER_RESOURCE) {
        var resourceState = {
            props: action.payload,
            data: data_1.default(undefined, action),
            list: list_1.default(undefined, action),
        };
        var newState_1 = __assign({}, previousState, (_a = {}, _a[action.payload.name] = resourceState, _a));
        return newState_1;
    }
    if (action.type === actions_1.UNREGISTER_RESOURCE) {
        var newState_2 = Object.keys(previousState).reduce(function (acc, key) {
            var _a;
            if (key === action.payload) {
                return acc;
            }
            return __assign({}, acc, (_a = {}, _a[key] = previousState[key], _a));
        }, {});
        return newState_2;
    }
    if (!action.meta || !action.meta.resource) {
        return previousState;
    }
    var resources = Object.keys(previousState);
    var newState = resources.reduce(function (acc, resource) {
        var _a;
        return (__assign({}, acc, (_a = {}, _a[resource] = action.meta.resource === resource
            ? {
                props: previousState[resource].props,
                data: data_1.default(previousState[resource].data, action),
                list: list_1.default(previousState[resource].list, action),
            }
            : previousState[resource], _a)));
    }, {});
    return newState;
});
exports.getResources = function (state) {
    return Object.keys(state).map(function (key) { return state[key].props; });
};
exports.getReferenceResource = function (state, props) { return state[props.reference]; };
//# sourceMappingURL=index.js.map