import React from 'react';
import {
    BooleanField,
    DateField,
    EmailField,
    ImageField,
    NumberField,
    ReferenceField,
    TextField,
    UrlField,
} from 'ra-ui-materialui';
import {
    FieldConfiguration,
    ResourceConfigurationMap,
} from '../ResourceConfiguration';

export const getFieldFromFieldDefinition = (
    definition: FieldConfiguration,
    resources: ResourceConfigurationMap
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
        case 'reference':
            const reference = resources[definition.props.reference];

            if (reference) {
                const field = reference.fields.find(
                    field =>
                        field.props.source === definition.options.referenceField
                );
                return (
                    <ReferenceField
                        key={definition.props.source}
                        {...definition.props}
                    >
                        {getFieldFromFieldDefinition(field, resources)}
                    </ReferenceField>
                );
            }

            return (
                <TextField
                    key={definition.props.source}
                    {...definition.props}
                />
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
