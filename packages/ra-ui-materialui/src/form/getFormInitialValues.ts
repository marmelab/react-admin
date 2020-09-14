import { Record } from 'ra-core';

export default function getFormInitialValues(
    initialValues: any,
    defaultValue: DefaultValue,
    record: Record
): any {
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

interface DefaultValueObject {
    [key: string]: any;
}
type DefaultValueFunction = (record: Record) => DefaultValueObject;
type DefaultValue = DefaultValueObject | DefaultValueFunction;
