import { useEffect, useState } from 'react';
import {
    getValuesFromRecords,
    InferredElementDescription,
    inferTypeFromValues,
    Record,
} from 'ra-core';
import inflection from 'inflection';
import { useResource } from '../ResourceBuilderContext';

export const useGetFieldDefinitions = (resource: string, records?: any[]) => {
    let [fieldDefinitions, setFieldDefinitions] = useState<
        InferredElementDescription[]
    >([]);

    const [resourceDefinition, resourceDefinitionActions] = useResource(
        resource
    );

    useEffect(() => {
        if (!resourceDefinition) {
            return;
        }

        if (resourceDefinition.fields && resourceDefinition.fields.length > 0) {
            setFieldDefinitions(resourceDefinition.fields);
        } else {
            const inferredFieldDefinitions = getFieldDefinitionsFromRecords(
                records
            );
            resourceDefinitionActions.update({
                fields: inferredFieldDefinitions,
            });
        }
    }, [resource, resourceDefinition, resourceDefinitionActions, records]);

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
