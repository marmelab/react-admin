export default function getFormInitialValues(
    initialValues,
    defaultValue,
    record
) {
    if (typeof defaultValue !== 'undefined') {
        console.warn(
            '"defaultValue" is deprecated, please use "initialValues" instead'
        );
    }

    return {
        ...getValues(defaultValue, record),
        ...getValues(initialValues, record),
        ...record,
    };
}

function getValues(values, record) {
    if (typeof values === 'object') {
        return values;
    }

    if (typeof values === 'function') {
        return values(record);
    }

    return {};
}
