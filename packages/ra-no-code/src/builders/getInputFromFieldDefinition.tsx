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
