import React from 'react';
import { email, InferredElementDescription } from 'ra-core';
import {
    BooleanInput,
    DateInput,
    ImageInput,
    NumberInput,
    TextInput,
} from 'ra-ui-materialui';

export const getInputFromFieldDefinition = (
    definition: InferredElementDescription,
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
                    getInputFromFieldDefinition(child, index.toString())
                );
            }
            return <>{getInputFromFieldDefinition(definition.children)}</>;
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
