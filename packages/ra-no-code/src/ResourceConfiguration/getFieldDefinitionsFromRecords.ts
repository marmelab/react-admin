import {
    getValuesFromRecords,
    InferredElementDescription,
    inferTypeFromValues,
    Record,
} from 'ra-core';
import inflection from 'inflection';

export const getFieldDefinitionsFromRecords = (
    records: Record[]
): InferredElementDescription[] => {
    const values = getValuesFromRecords(records);

    return Object.keys(values).map(key => {
        const type = inferTypeFromValues(key, values[key]);

        return {
            ...type,
            props: {
                ...type.props,
                label: inflection.transform(type.props.source, [
                    'underscore',
                    'humanize',
                ]),
            },
        };
    });
};
