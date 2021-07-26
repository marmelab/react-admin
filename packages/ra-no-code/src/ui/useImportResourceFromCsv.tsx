import { useState } from 'react';
import { parse } from 'papaparse';
import { getValuesFromRecords, Record, useDataProvider } from 'ra-core';
import set from 'lodash/set';

import {
    useResourcesConfiguration,
    getFieldDefinitionsFromRecords,
} from '../ResourceConfiguration';

/**
 * This hooks returns a tuple with its first element being a boolean indicating whether an import is ongoing, and the second element a function to call with a resource name and a file to import.
 *
 * @param onImportCompleted A function called once the import is completed. Receive an object containing the resource imported and the resourceAlreadyExists boolean.
 * @returns {[boolean, ImportResource]}
 */
export const useImportResourceFromCsv = (): [boolean, ImportResource] => {
    const [parsing, setParsing] = useState(false);
    const dataProvider = useDataProvider();
    const [resources, { addResource }] = useResourcesConfiguration();

    const importResource = async (resource: string, file: File) => {
        setParsing(true);
        const resourceAlreadyExists = !!resources[resource];
        const { data, meta } = await parseCSV(file);
        const records = sanitizeRecords(
            data.filter(record => !!record.id),
            meta
        );
        await Promise.all(
            records.map(record => {
                return dataProvider
                    .create(resource, {
                        data: record,
                    })
                    .catch(error => {
                        // Ignore errors while adding a single record
                        console.error(
                            `Error while importing record ${JSON.stringify(
                                record,
                                null,
                                4
                            )}`
                        );
                    });
            })
        );
        setParsing(false);
        const fields = getFieldDefinitionsFromRecords(records);
        addResource({ name: resource, fields });
        return { resource, resourceAlreadyExists };
    };

    return [parsing, importResource];
};

const parseCSV = (file: File): Promise<{ data: Record[]; meta: any }> =>
    new Promise((resolve, reject) => {
        parse<Record>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async ({ data, meta }) => {
                resolve({ data, meta });
            },
            error: error => {
                reject(error);
            },
        });
    });

type ImportResource = (
    resource: string,
    file: File
) => Promise<{
    resourceAlreadyExists: boolean;
    resource: string;
}>;

const sanitizeRecords = (
    records: Record[],
    { fields }: { fields: string[] }
): Record[] => {
    const values = getValuesFromRecords(records);
    return fields.reduce(
        (newRecords, field) => sanitizeRecord(newRecords, values, field),
        [...records]
    );
};

const sanitizeRecord = (records, values, field) => {
    if (field.split('.').length > 1) {
        return records.map(record => {
            let { [field]: pathField, ...newRecord } = record;
            return set(newRecord, field, record[field]);
        });
    }

    const fieldValues = values[field];

    if (
        fieldValues.some(value =>
            ['false', 'true'].includes(value.toString().toLowerCase())
        )
    ) {
        return records.map(record =>
            set(record, field, Boolean(record[field]))
        );
    }

    return records;
};
