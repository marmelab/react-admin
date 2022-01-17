import {
    getValuesFromRecords,
    inferTypeFromValues,
    RaRecord,
} from 'react-admin';
import { FieldConfiguration } from './ResourceConfigurationContext';

export const getFieldDefinitionsFromRecords = (
    records: RaRecord[]
): FieldConfiguration[] => {
    const values = getValuesFromRecords(records);

    return Object.keys(values).map(key => {
        const inferedDefinition = inferTypeFromValues(key, values[key]);

        return {
            ...inferedDefinition,
            options:
                inferedDefinition.type === 'reference'
                    ? {
                          referenceField: 'id',
                          selectionType: 'select',
                      }
                    : undefined,
            views: ['list', 'create', 'edit', 'show'],
        };
    });
};
