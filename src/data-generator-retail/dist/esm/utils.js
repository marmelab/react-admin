import faker from 'faker/locale/en';
export var weightedArrayElement = function (values, weights) {
    return faker.random.arrayElement(values.reduce(function (acc, value, index) {
        return acc.concat(new Array(weights[index]).fill(value));
    }, []));
};
export var weightedBoolean = function (likelyhood) {
    return faker.random.number(99) < likelyhood;
};
export var randomDate = function (minDate, maxDate) {
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
    var randomRange = faker.random.number({ max: range });
    // move it more towards today to account for traffic increase
    var ts = Math.sqrt(randomRange / range) * range;
    return new Date(minTs + ts);
};
export var randomFloat = function (min, max) {
    return parseFloat(faker.random.number({ min: min, max: max, precision: 0.01 }).toFixed(2));
};
//# sourceMappingURL=utils.js.map