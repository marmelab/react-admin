import {
    getValuesFromRecords,
    InferredElementDescription,
    inferTypeFromValues,
    Record,
} from 'ra-core';

export const getFieldDefinitionsFromRecords = (
    records: Record[]
): InferredElementDescription[] => {
    const values = getValuesFromRecords(records);

    return Object.keys(values).map(key =>
        inferTypeFromValues(key, values[key])
    );
};
