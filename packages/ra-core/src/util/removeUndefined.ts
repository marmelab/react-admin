const isPlainObject = (value: unknown): value is Record<string, any> =>
    Object.prototype.toString.call(value) === '[object Object]';

const removeUndefined = <T>(value: T): T => {
    if (Array.isArray(value)) {
        return value.map(item => removeUndefined(item)) as T;
    }

    if (!isPlainObject(value)) {
        return value;
    }

    return Object.entries(value).reduce((acc, [key, child]) => {
        if (child === undefined) {
            return acc;
        }

        return Object.assign(acc, { [key]: removeUndefined(child) });
    }, {} as Record<string, any>) as T;
};

export default removeUndefined;
