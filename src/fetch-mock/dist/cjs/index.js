"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultFetchMockConfig = exports.FetchMock = void 0;
var FetchMock_js_1 = require("./FetchMock.js");
Object.defineProperty(exports, "FetchMock", { enumerable: true, get: function () { return FetchMock_js_1.FetchMock; } });
Object.defineProperty(exports, "defaultFetchMockConfig", { enumerable: true, get: function () { return FetchMock_js_1.defaultFetchMockConfig; } });
const FetchMock_js_2 = __importDefault(require("./FetchMock.js"));
exports.default = FetchMock_js_2.default;
