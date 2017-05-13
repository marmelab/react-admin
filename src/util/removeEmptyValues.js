const recursiveRemoveEmptyValues = (thing) => {
    let thingRes;
    let isArray;
    if (thing === null || thing === undefined) {
        return null;
    }
    if (typeof thing === 'number') {
        return thing;
    }

    if (typeof thing === 'string') {
        thingRes = thing.trim();
        return thingRes === '' ? null : thingRes;
    }

    if (Array.isArray(thing)) {
        isArray = true;
        thingRes = [];
    } else {
        thingRes = {};
    }

    Object.keys(thing).forEach((filterIndex) => {
        const value = recursiveRemoveEmptyValues(thing[filterIndex]);
        if (value !== null) {
            if (isArray) {
                thingRes.push(value);
            } else {
                thingRes[filterIndex] = value;
            }
        }
    });

    return Object.keys(thingRes).length === 0 ? null : thingRes;
};

const removeEmptyValues = obj => recursiveRemoveEmptyValues(obj) || {};

export default removeEmptyValues;
