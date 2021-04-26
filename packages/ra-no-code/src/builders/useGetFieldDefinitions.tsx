import React, { useEffect, useState } from 'react';
import {
    email,
    getValuesFromRecords,
    InferredElementDescription,
    inferTypeFromValues,
    Record,
} from 'ra-core';
import {
    BooleanField,
    BooleanInput,
    DateField,
    DateInput,
    EmailField,
    ImageField,
    ImageInput,
    NumberField,
    NumberInput,
    TextField,
    TextInput,
    UrlField,
} from 'ra-ui-materialui';
import inflection from 'inflection';

export const useGetFieldDefinitions = (resource: string, records?: any[]) => {
    let [fieldDefinitions, setFieldDefinitions] = useState<
        InferredElementDescription[]
    >([]);

    useEffect(() => {
        const storageKey = `@@ra-no-code.${resource}.definitions`;
        let storedFieldDefinitions = localStorage.getItem(storageKey);
        if (storedFieldDefinitions) {
            setFieldDefinitions(JSON.parse(storedFieldDefinitions));
        } else {
            if (!records || records.length === 0) {
                return;
            }
            if (records && records.length > 0) {
                const definitions = getFieldDefinitionsFromRecords(records);
                localStorage.setItem(storageKey, JSON.stringify(definitions));
                setFieldDefinitions(definitions);
            }
        }
    }, [resource, records]);

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

export const getFieldFromFieldDefinition = (
    definition: InferredElementDescription
) => {
    switch (definition.type) {
        case 'date':
            return (
                <DateField
                    key={definition.props.source}
                    {...definition.props}
                />
            );
        case 'email':
            return (
                <EmailField
                    key={definition.props.source}
                    {...definition.props}
                />
            );
        case 'boolean':
            return (
                <BooleanField
                    key={definition.props.source}
                    {...definition.props}
                />
            );
        case 'number':
            return (
                <NumberField
                    key={definition.props.source}
                    {...definition.props}
                />
            );
        case 'image':
            return (
                <ImageField
                    key={definition.props.source}
                    {...definition.props}
                />
            );
        case 'url':
            return (
                <UrlField key={definition.props.source} {...definition.props} />
            );
        default:
            return (
                <TextField
                    key={definition.props.source}
                    {...definition.props}
                />
            );
    }
};

export const getInputFromFieldDefinition = (
    definition: InferredElementDescription
) => {
    switch (definition.type) {
        case 'date':
            return (
                <DateInput
                    key={definition.props.source}
                    {...definition.props}
                />
            );
        case 'email':
            return (
                <TextInput
                    key={definition.props.source}
                    validate={email()}
                    {...definition.props}
                />
            );
        case 'boolean':
            return (
                <BooleanInput
                    key={definition.props.source}
                    {...definition.props}
                />
            );
        case 'number':
            return (
                <NumberInput
                    key={definition.props.source}
                    {...definition.props}
                />
            );
        case 'image':
            return (
                <ImageInput
                    key={definition.props.source}
                    {...definition.props}
                />
            );
        case 'url':
            return (
                <TextInput
                    key={definition.props.source}
                    {...definition.props}
                />
            );
        default:
            return (
                <TextInput
                    key={definition.props.source}
                    {...definition.props}
                />
            );
    }
};
