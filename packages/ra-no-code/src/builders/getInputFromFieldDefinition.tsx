import React from 'react';
import { email, InferredElementDescription } from 'ra-core';
import {
    BooleanInput,
    DateInput,
    ImageInput,
    NumberInput,
    ReferenceInput,
    TextInput,
} from 'ra-ui-materialui';
import {
    FieldConfiguration,
    ReferenceFieldConfiguration,
    ResourceConfigurationMap,
} from '../ResourceConfiguration';
import { ReferenceInputChildFromDefinition } from './ReferenceInputChildFromDefinition';

export const getInputFromFieldDefinition = (
    definition: FieldConfiguration | InferredElementDescription,
    resources: ResourceConfigurationMap,
    keyPrefix?: string
) => {
    switch (definition.type) {
        case 'date':
            return (
                <DateInput
                    key={getKey(keyPrefix, definition.props.source)}
                    {...definition.props}
                />
            );
        case 'email':
            return (
                <TextInput
                    key={getKey(keyPrefix, definition.props.source)}
                    validate={email()}
                    {...definition.props}
                />
            );
        case 'boolean':
            return (
                <BooleanInput
                    key={getKey(keyPrefix, definition.props.source)}
                    {...definition.props}
                />
            );
        case 'number':
            return (
                <NumberInput
                    key={getKey(keyPrefix, definition.props.source)}
                    {...definition.props}
                />
            );
        case 'image':
            return (
                <ImageInput
                    key={getKey(keyPrefix, definition.props.source)}
                    {...definition.props}
                />
            );
        case 'url':
            return (
                <TextInput
                    key={getKey(keyPrefix, definition.props.source)}
                    {...definition.props}
                />
            );
        case 'object':
            if (Array.isArray(definition.children)) {
                return definition.children.map((child, index) =>
                    getInputFromFieldDefinition(
                        child,
                        resources,
                        index.toString()
                    )
                );
            }
            return (
                <>
                    {getInputFromFieldDefinition(
                        definition.children,
                        resources,
                        undefined
                    )}
                </>
            );
        case 'reference':
            const referenceDefinition = definition as ReferenceFieldConfiguration;
            const reference = resources[definition.props.reference];

            if (reference) {
                return (
                    <ReferenceInput
                        key={definition.props.source}
                        {...definition.props}
                    >
                        <ReferenceInputChildFromDefinition
                            definition={referenceDefinition}
                        />
                    </ReferenceInput>
                );
            }

            return (
                <TextInput
                    key={definition.props.source}
                    {...definition.props}
                />
            );

        default:
            return (
                <TextInput
                    key={getKey(keyPrefix, definition.props.source)}
                    {...definition.props}
                />
            );
    }
};

const getKey = (prefix, source) => (prefix ? `${prefix}_${source}` : source);
