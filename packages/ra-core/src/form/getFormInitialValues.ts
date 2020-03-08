export default function getFormInitialValues(
    initialValues,
    defaultValue,
    record
) {
    let finalInitialValues = {
        ...initialValues,
        ...record,
    };

    if (typeof defaultValue !== 'undefined') {
        console.warn(
            '"defaultValue" is deprecated, please use "initialValues" instead'
        );
    }

    if (typeof defaultValue === 'object') {
        finalInitialValues = {
            ...defaultValue,
            ...finalInitialValues,
        };
    } else if (typeof defaultValue === 'function') {
        finalInitialValues = {
            ...defaultValue(record),
            ...finalInitialValues,
        };
    }

    return finalInitialValues;
}
