import * as React from 'react';
import { getFieldLabelTranslationArgs, useTranslate } from 'ra-core';
import { TextInput } from 'ra-ui-materialui';
import { CardContent } from '@material-ui/core';
import { FieldTypeInput } from './FieldConfiguration/FieldTypeInput';
import { FieldViewsInput } from './FieldConfiguration/FieldViewsInput';
import { ConfigurationInputsFromFieldDefinition } from './ConfigurationInputsFromFieldDefinition';

export const FieldConfigurationFormSection = props => {
    const { sourcePrefix, field, resource } = props;
    const translate = useTranslate();
    const labelArgs = getFieldLabelTranslationArgs({
        source: field.props.source,
        resource,
        label: field.props.label,
    });

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
                initialValue={translate(...labelArgs)}
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
