import { getValuesFromRecords, inferTypeFromValues, Record } from 'ra-core';
import { FieldConfiguration } from './ResourceConfigurationContext';

export const getFieldDefinitionsFromRecords = (
    records: Record[]
): FieldConfiguration[] => {
    const values = getValuesFromRecords(records);

    return Object.keys(values).map(key => ({
        ...inferTypeFromValues(key, values[key]),
        views: ['list', 'create', 'edit', 'show'],
    }));
};
