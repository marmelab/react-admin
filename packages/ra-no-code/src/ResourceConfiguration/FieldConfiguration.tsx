import * as React from 'react';
import {
    getFieldLabelTranslationArgs,
    InferenceTypes,
    useTranslate,
} from 'ra-core';
import { SelectInput, TextInput } from 'ra-ui-materialui';
import { CardContent } from '@material-ui/core';
import { textChangeRangeIsUnchanged } from 'typescript';

export const FieldConfiguration = props => {
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
            <SelectInput
                source={`fields[${index}].type`}
                label="Type"
                fullWidth
                choices={InferenceTypes.map(type => ({
                    id: type,
                    name: type,
                }))}
            />
        </CardContent>
    );
};
