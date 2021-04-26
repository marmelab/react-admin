import { useEffect, useState } from 'react';
import {
    getValuesFromRecords,
    InferredElementDescription,
    inferTypeFromValues,
    Record,
} from 'ra-core';
import inflection from 'inflection';
import { StorageKey } from '../constants';

export const useGetFieldDefinitions = (resource: string, records?: any[]) => {
    let [fieldDefinitions, setFieldDefinitions] = useState<
        InferredElementDescription[]
    >([]);

    useEffect(() => {
        setFieldDefinitions(getFieldDefinition(resource, records));
    }, [resource, records]);

    return fieldDefinitions;
};

const getFieldDefinition = (resource: string, records?: any[]) => {
    const storedDefinitions = localStorage.getItem(StorageKey);
    let definitions;

    if (storedDefinitions) {
        definitions = JSON.parse(storedDefinitions);
        if (definitions[resource] && definitions[resource].fields) {
            return definitions[resource].fields;
        }
    }

    if (!records || records.length === 0) {
        return [];
    }

    const fieldDefinitions = getFieldDefinitionsFromRecords(records);
    definitions[resource] = {
        ...definitions[resource],
        fields: fieldDefinitions,
    };
    localStorage.setItem(StorageKey, JSON.stringify(definitions));
    return fieldDefinitions;
};

const getFieldDefinitionsFromRecords = (
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
