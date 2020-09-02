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
        ...getValues(defaultValue),
        ...getValues(initialValues),
        ...record,
    };
}

function getValues(values) {
    if (typeof values === 'object') {
        return values;
    }

    if (typeof values === 'function') {
        return values();
    }

    return {};
}
