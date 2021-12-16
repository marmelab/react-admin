import merge from 'lodash/merge';
import { Record } from '../types';

export default function getFormInitialValues(
    initialValues: any,
    defaultValue: DefaultValue,
    record: Partial<Record>
) {
    if (typeof defaultValue !== 'undefined') {
        console.warn(
            '"defaultValue" is deprecated, please use "initialValues" instead'
        );
    }

    const finalInitialValues = merge(
        {},
        getValues(defaultValue, record),
        getValues(initialValues, record),
        record
    );
    return finalInitialValues;
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

interface DefaultValueObject {
    [key: string]: any;
}
type DefaultValueFunction = (record: Record) => DefaultValueObject;
type DefaultValue = DefaultValueObject | DefaultValueFunction;
