import merge from 'lodash/merge';

/**
 * Because final-form removes undefined and empty string values completely
 * (the key for the empty field is removed from the values), we have to check
 * whether this value was initially provided so that it is correctly sent to
 * the backend.
 * @see https://github.com/final-form/react-final-form/issues/130#issuecomment-493447888
 *
 * @param initialValues The initial values provided to the form
 * @param values The current form values
 */
const sanitizeEmptyValues = (initialValues: object, values: object) => {
    // For every field initially provided, we check whether it value has been removed
    // and set it explicitly to an empty string
    if (!initialValues) return values;
    const initialValuesWithEmptyFields = Object.keys(initialValues).reduce(
        (acc, key) => {
            if (values[key] instanceof Date) {
                acc[key] = values[key];
            } else if (Array.isArray(values[key])) {
                if (Array.isArray(initialValues[key])) {
                    acc[key] = values[key].map((value, index) =>
                        sanitizeEmptyValues(initialValues[key][index], value)
                    );
                } else {
                    acc[key] = values[key];
                }
            } else if (
                typeof values[key] === 'object' &&
                typeof initialValues[key] === 'object' &&
                values[key] !== null
            ) {
                acc[key] = sanitizeEmptyValues(initialValues[key], values[key]);
            } else {
                acc[key] =
                    typeof values[key] === 'undefined' ? null : values[key];
            }
            return acc;
        },
        {}
    );

    // Finally, we merge back the values to not miss any which wasn't initially provided
    return merge(initialValuesWithEmptyFields, values);
};

export default sanitizeEmptyValues;
