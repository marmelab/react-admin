"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomFloat = exports.randomDate = exports.weightedBoolean = exports.weightedArrayElement = void 0;
var en_1 = __importDefault(require("faker/locale/en"));
var weightedArrayElement = function (values, weights) {
    return en_1.default.random.arrayElement(values.reduce(function (acc, value, index) {
        return acc.concat(new Array(weights[index]).fill(value));
    }, []));
};
exports.weightedArrayElement = weightedArrayElement;
var weightedBoolean = function (likelyhood) {
    return en_1.default.random.number(99) < likelyhood;
};
exports.weightedBoolean = weightedBoolean;
var randomDate = function (minDate, maxDate) {
    var minTs = minDate instanceof Date
        ? minDate.getTime()
        : typeof minDate === 'string'
            ? new Date(minDate).getTime()
            : Date.now() - 5 * 365 * 24 * 60 * 60 * 1000; // 5 years
    var maxTs = maxDate instanceof Date
        ? maxDate.getTime()
        : typeof maxDate === 'string'
            ? new Date(maxDate).getTime()
            : Date.now();
    var range = maxTs - minTs;
    var randomRange = en_1.default.random.number({ max: range });
    // move it more towards today to account for traffic increase
    var ts = Math.sqrt(randomRange / range) * range;
    return new Date(minTs + ts);
};
exports.randomDate = randomDate;
var randomFloat = function (min, max) {
    return parseFloat(en_1.default.random.number({ min: min, max: max, precision: 0.01 }).toFixed(2));
};
exports.randomFloat = randomFloat;
//# sourceMappingURL=utils.js.map