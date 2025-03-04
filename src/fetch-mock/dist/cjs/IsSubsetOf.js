"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSubsetOf = void 0;
const TypeDescriptor_js_1 = require("./TypeDescriptor.js");
const allowedTypes = new Set(['array', 'object', 'function', 'null']);
const isSubsetOf = function (subset, superset, visited = []) {
    const subsetType = TypeDescriptor_js_1.Type.of(subset);
    const supersetType = TypeDescriptor_js_1.Type.of(superset);
    if (!allowedTypes.has(subsetType)) {
        throw new Error(`Type '${subsetType}' is not supported.`);
    }
    if (!allowedTypes.has(supersetType)) {
        throw new Error(`Type '${supersetType}' is not supported.`);
    }
    if (TypeDescriptor_js_1.Type.isFunction(subset)) {
        if (!TypeDescriptor_js_1.Type.isFunction(superset)) {
            throw new Error(`Types '${subsetType}' and '${supersetType}' do not match.`);
        }
        return subset.toString() === superset.toString();
    }
    if (TypeDescriptor_js_1.Type.isArray(subset)) {
        if (!TypeDescriptor_js_1.Type.isArray(superset)) {
            throw new Error(`Types '${subsetType}' and '${supersetType}' do not match.`);
        }
        if (subset.length > superset.length) {
            return false;
        }
        for (const subsetItem of subset) {
            const subsetItemType = TypeDescriptor_js_1.Type.of(subsetItem);
            let isItemInSuperset;
            switch (subsetItemType) {
                case 'array':
                case 'object':
                case 'function': {
                    if (visited.includes(subsetItem)) {
                        continue;
                    }
                    visited.push(subsetItem);
                    isItemInSuperset = superset.some((supersetItem) => {
                        try {
                            return isSubsetOf(subsetItem, supersetItem, visited);
                        }
                        catch {
                            return false;
                        }
                    });
                    break;
                }
                default: {
                    isItemInSuperset = superset.includes(subsetItem);
                }
            }
            if (!isItemInSuperset) {
                return false;
            }
        }
        return true;
    }
    if (TypeDescriptor_js_1.Type.isObject(subset)) {
        if (!TypeDescriptor_js_1.Type.isObject(superset) || TypeDescriptor_js_1.Type.isArray(superset)) {
            throw new Error(`Types '${subsetType}' and '${supersetType}' do not match.`);
        }
        if (Object.keys(subset).length > Object.keys(superset).length) {
            return false;
        }
        for (const [subsetKey, subsetValue] of Object.entries(subset)) {
            const supersetValue = superset[subsetKey];
            const subsetValueType = TypeDescriptor_js_1.Type.of(subsetValue);
            switch (subsetValueType) {
                case 'array':
                case 'object':
                case 'function': {
                    if (visited.includes(subsetValue)) {
                        continue;
                    }
                    visited.push(subsetValue);
                    try {
                        const isInSuperset = isSubsetOf(subsetValue, supersetValue, visited);
                        if (!isInSuperset) {
                            return false;
                        }
                    }
                    catch {
                        return false;
                    }
                    break;
                }
                default: {
                    if (subsetValue !== supersetValue) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    if (TypeDescriptor_js_1.Type.isNull(subset)) {
        if (!TypeDescriptor_js_1.Type.isNull(superset)) {
            throw new Error(`Types '${subsetType}' and '${supersetType}' do not match.`);
        }
        return true;
    }
    throw new Error('Invalid operation.');
};
exports.isSubsetOf = isSubsetOf;
isSubsetOf.structural = function (subset, superset, visited = []) {
    if (!TypeDescriptor_js_1.Type.isObject(subset)) {
        throw new Error(`Type '${TypeDescriptor_js_1.Type.of(subset)}' is not supported.`);
    }
    if (!TypeDescriptor_js_1.Type.isObject(superset)) {
        throw new Error(`Type '${TypeDescriptor_js_1.Type.of(superset)}' is not supported.`);
    }
    for (const [subsetKey, subsetValue] of Object.entries(subset)) {
        if (superset[subsetKey] === undefined) {
            return false;
        }
        const subsetValueType = TypeDescriptor_js_1.Type.of(subsetValue);
        const supersetValue = superset[subsetKey];
        if (subsetValueType === 'object') {
            if (visited.includes(subsetValue)) {
                continue;
            }
            visited.push(subsetValue);
            try {
                const isInSuperset = isSubsetOf.structural(subsetValue, supersetValue, visited);
                if (!isInSuperset) {
                    return false;
                }
            }
            catch {
                return false;
            }
        }
    }
    return true;
};
