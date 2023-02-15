/**
 * Remove empty strings from form state
 *
 * @example
 * sanitizeEmptyValues({ foo: '', bar: 'baz' }) // { bar: 'baz' }
 */
export const sanitizeEmptyValues = (values: any, record: any = {}): any => {
    const sanitizedValues = {};
    Object.keys(values).forEach(key => {
        if (values[key] == null || values[key] === '') {
            if (record.hasOwnProperty(key)) {
                // user has emptied a field, make the value null
                sanitizedValues[key] = null;
            } else {
                // user has emptied a field, but the initial value was undefined
                // so we don't include it in the sanitized values
            }
        } else {
            // this is a non-empty value, so we include it in the sanitized values
            sanitizedValues[key] = values[key];
        }
    });
    return sanitizedValues;
};
