"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
const valueTypes = new Set([
    'boolean',
    'number',
    'null',
    'string',
    'undefined',
]);
const referenceTypes = new Set(['array', 'function', 'object', 'symbol']);
const detectableTypes = new Set([
    'boolean',
    'function',
    'number',
    'string',
    'symbol',
]);
const typeConstructors = new Set([Boolean, Number, String]);
class TypeDescriptor {
    constructor(value) {
        this.name = TypeDescriptor.of(value);
        this.isValueType = TypeDescriptor.isValueType(value);
        this.isReferenceType = TypeDescriptor.isReferenceType(value);
        this.isArray = TypeDescriptor.isArray(value);
        this.isBoolean = TypeDescriptor.isBoolean(value);
        this.isFunction = TypeDescriptor.isFunction(value);
        this.isNull = TypeDescriptor.isNull(value);
        this.isNumber = TypeDescriptor.isNumber(value);
        this.isObject = TypeDescriptor.isObject(value);
        this.isString = TypeDescriptor.isString(value);
        this.isSymbol = TypeDescriptor.isSymbol(value);
        this.isUndefined = TypeDescriptor.isUndefined(value);
    }
    static of(value) {
        if (value === null) {
            return 'null';
        }
        if (value === undefined) {
            return 'undefined';
        }
        const detectedType = typeof value;
        if (detectableTypes.has(detectedType)) {
            return detectedType;
        }
        if (detectedType === 'object') {
            if (Array.isArray(value)) {
                return 'array';
            }
            if (typeConstructors.has(value.constructor)) {
                return value.constructor.name.toLowerCase();
            }
            return detectedType;
        }
        throw new Error('Failed due to an unknown type.');
    }
    static from(value) {
        return new TypeDescriptor(value);
    }
    static isValueType(value) {
        return valueTypes.has(TypeDescriptor.of(value));
    }
    static isReferenceType(value) {
        return referenceTypes.has(TypeDescriptor.of(value));
    }
    static isArray(value) {
        return TypeDescriptor.of(value) === 'array';
    }
    static isBoolean(value) {
        return TypeDescriptor.of(value) === 'boolean';
    }
    static isFunction(value) {
        return TypeDescriptor.of(value) === 'function';
    }
    static isNull(value) {
        return TypeDescriptor.of(value) === 'null';
    }
    static isNumber(value) {
        return TypeDescriptor.of(value) === 'number';
    }
    static isObject(value) {
        return TypeDescriptor.of(value) === 'object';
    }
    static isString(value) {
        return TypeDescriptor.of(value) === 'string';
    }
    static isSymbol(value) {
        return TypeDescriptor.of(value) === 'symbol';
    }
    static isUndefined(value) {
        return TypeDescriptor.of(value) === 'undefined';
    }
}
exports.Type = TypeDescriptor;
