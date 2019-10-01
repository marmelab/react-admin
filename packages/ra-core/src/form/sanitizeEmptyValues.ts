import merge from 'lodash/merge';

/**
 * Because final-form removes undefined and empty string values completely
 * (the key for the empty field is removed from the values), we have to check
 * wether this value was initially provided so that it is correctly sent to
 * the backend.
 * See https://github.com/final-form/react-final-form/issues/130#issuecomment-493447888
 *
 * @param initialValues The initial values provided to the form
 * @param values The current form values
 */
const sanitizeEmptyValues = (initialValues: object, values: object) => {
    // For every field initialy provided, we check wether it value has been removed
    // and set it explicitly to an empty string
    const initialValuesWithEmptyFields = Object.keys(initialValues).reduce(
        (acc, key) => {
            if (typeof values[key] === 'object' && values[key] !== null) {
                acc[key] = sanitizeEmptyValues(initialValues[key], values[key]);
            } else {
                acc[key] =
                    typeof values[key] === 'undefined' ? '' : values[key];
            }
            return acc;
        },
        {}
    );

    // Finaly, we merge back the values to not miss any which wasn't initialy provided
    return merge(initialValuesWithEmptyFields, values);
};

export default sanitizeEmptyValues;
