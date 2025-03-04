declare class TypeDescriptor {
    name: string;
    isValueType: boolean;
    isReferenceType: boolean;
    isArray: boolean;
    isBoolean: boolean;
    isFunction: boolean;
    isNull: boolean;
    isNumber: boolean;
    isObject: boolean;
    isString: boolean;
    isSymbol: boolean;
    isUndefined: boolean;
    protected constructor(value: any);
    static of(value: any): string;
    static from(value: any): TypeDescriptor;
    static isValueType(value: any): value is boolean | number | null | string | undefined;
    static isReferenceType(value: any): value is any[] | Function | object | symbol;
    static isArray(value: any): value is any[];
    static isBoolean(value: any): value is boolean;
    static isFunction(value: any): value is Function;
    static isNull(value: any): value is null;
    static isNumber(value: any): value is number;
    static isObject(value: any): value is object;
    static isString(value: any): value is string;
    static isSymbol(value: any): value is symbol;
    static isUndefined(value: any): value is undefined;
}
export { TypeDescriptor as Type };
