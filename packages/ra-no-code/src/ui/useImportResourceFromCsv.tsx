import { useState } from 'react';
import { parse } from 'papaparse';
import { getValuesFromRecords, RaRecord, useDataProvider } from 'react-admin';
import isObject from 'lodash/isObject.js';
import set from 'lodash/set.js';
import toPath from 'lodash/toPath.js';

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
                    .catch(() => {
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

const parseCSV = (file: File): Promise<{ data: RaRecord[]; meta: any }> =>
    new Promise((resolve, reject) => {
        parse<RaRecord>(file, {
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
    records: RaRecord[],
    { fields }: { fields: string[] }
): RaRecord[] => {
    const values = getValuesFromRecords(records);
    return fields.reduce(
        (newRecords, field) => sanitizeRecord(newRecords, values, field),
        [...records]
    );
};

// lodash set() follows inherited properties (except __proto__, constructor and prototype),
// so a path such as 'address.toString.foo' would write on a shared built-in
const pathFollowsInheritedProperty = (record, path: string) => {
    let current = record;
    return toPath(path)
        .slice(0, -1)
        .some(key => {
            // set() replaces missing and primitive values by a new object or array
            const object = isObject(current) ? current : {};
            current = object[key];
            return (
                key in object &&
                !Object.prototype.hasOwnProperty.call(object, key)
            );
        });
};

const sanitizeRecord = (records, values, field) => {
    if (field.split('.').length > 1) {
        return records.map(record => {
            const { [field]: pathField, ...newRecord } = record;
            if (pathFollowsInheritedProperty(newRecord, field)) {
                return newRecord;
            }
            return set(newRecord, field, record[field]);
        });
    }

    const fieldValues = values[field];

    if (
        fieldValues.some(value =>
            ['false', 'true'].includes(value.toString().toLowerCase())
        )
    ) {
        // field is a key here, not a path
        return records.map(record => ({
            ...record,
            [field]: Boolean(record[field]),
        }));
    }

    return records;
};
