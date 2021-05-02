import { useState } from 'react';
import { parse } from 'papaparse';
import { Record, useDataProvider } from 'ra-core';

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
export const useImportResourceFromCsv = (
    onImportCompleted: ImportCompletedHandler
): [boolean, ImportResource] => {
    const [parsing, setParsing] = useState(false);
    const dataProvider = useDataProvider();
    const [resources, { addResource }] = useResourcesConfiguration();

    const importResource = (resource: string, file: File) => {
        setParsing(true);
        parse<Record>(file, {
            header: true,
            complete: async ({ data }) => {
                const resourceAlreadyExists = !!resources[resource];

                await Promise.all(
                    data.map(record => {
                        if (record.id) {
                            return dataProvider
                                .create(resource, {
                                    data: record,
                                })
                                .catch(error => console.error(error));
                        }
                        return Promise.resolve();
                    })
                );
                setParsing(false);
                const fields = getFieldDefinitionsFromRecords(data);
                addResource({ name: resource, fields });
                onImportCompleted({ resource, resourceAlreadyExists });
            },
        });
    };

    return [parsing, importResource];
};

type ImportResource = (resource: string, file: File) => void;
type ImportCompletedHandler = ({
    resourceAlreadyExists,
    resource,
}: {
    resourceAlreadyExists: boolean;
    resource: string;
}) => void;
