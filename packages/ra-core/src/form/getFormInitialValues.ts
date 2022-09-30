import merge from 'lodash/merge';
import { RaRecord } from '../types';

export default function getFormInitialValues(
    defaultValues: DefaultValue,
    record?: Partial<RaRecord>
) {
    const finalInitialValues = merge(
        {},
        getValues(defaultValues, record),
        record
    );
    // replace null values by empty string to avoid controllezd/ uncontrolled input warning
    Object.keys(finalInitialValues).forEach(key => {
        if (finalInitialValues[key] === null) {
            finalInitialValues[key] = '';
        }
    });
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
type DefaultValueFunction = (record: RaRecord) => DefaultValueObject;
type DefaultValue = DefaultValueObject | DefaultValueFunction;
