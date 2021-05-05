import * as React from 'react';
import {
    getFieldLabelTranslationArgs,
    InferenceTypes,
    useTranslate,
} from 'ra-core';
import { CheckboxGroupInput, SelectInput, TextInput } from 'ra-ui-materialui';
import { CardContent } from '@material-ui/core';
import { FieldTypeInput } from './FieldConfiguration/FieldTypeInput';
import { FieldViewsInput } from './FieldConfiguration/FieldViewsInput';

export const FieldConfigurationFormSection = props => {
    const { index, field, resource } = props;
    const translate = useTranslate();
    const labelArgs = getFieldLabelTranslationArgs({
        source: field.props.source,
        resource,
        label: field.props.label,
    });

    return (
        <CardContent>
            <TextInput
                source={`fields[${index}].props.source`}
                label="Source"
                fullWidth
                disabled
            />
            <TextInput
                source={`fields[${index}].props.label`}
                label="Label"
                fullWidth
                initialValue={translate(...labelArgs)}
            />
            <FieldTypeInput
                source={`fields[${index}].type`}
                label="Type"
                fullWidth
            />
            <FieldViewsInput
                source={`fields[${index}].views`}
                label="Views"
                fullWidth
            />
        </CardContent>
    );
};
