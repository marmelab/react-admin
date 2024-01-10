import * as React from 'react';
import { TextInput, useTranslateLabel } from 'react-admin';
import { CardContent } from '@mui/material';
import { FieldTypeInput } from './FieldConfiguration/FieldTypeInput';
import { FieldViewsInput } from './FieldConfiguration/FieldViewsInput';
import { ConfigurationInputsFromFieldDefinition } from './ConfigurationInputsFromFieldDefinition';

export const FieldConfigurationFormSection = props => {
    const { sourcePrefix, field, resource } = props;
    const translateLabel = useTranslateLabel();
    const labelArgs = {
        source: field.props.source,
        resource,
        label: field.props.label,
    };

    return (
        <CardContent>
            <TextInput
                source={`${sourcePrefix}.props.source`}
                label="Source"
                fullWidth
                disabled
            />
            <TextInput
                source={`${sourcePrefix}.props.label`}
                label="Label"
                fullWidth
                defaultValue={translateLabel(labelArgs)}
            />
            <FieldTypeInput
                source={`${sourcePrefix}.type`}
                label="Type"
                fullWidth
            />
            <FieldViewsInput
                source={`${sourcePrefix}.views`}
                label="Views"
                fullWidth
            />
            <ConfigurationInputsFromFieldDefinition
                definition={field}
                sourcePrefix={sourcePrefix}
            />
        </CardContent>
    );
};
