import React from 'react';
import { InferredElementDescription } from 'ra-core';
import {
    BooleanField,
    DateField,
    EmailField,
    ImageField,
    NumberField,
    TextField,
    UrlField,
} from 'ra-ui-materialui';

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
