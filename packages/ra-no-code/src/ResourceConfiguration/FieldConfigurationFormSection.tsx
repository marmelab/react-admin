import * as React from 'react';
import {
    getFieldLabelTranslationArgs,
    InferenceTypes,
    useTranslate,
} from 'ra-core';
import { CheckboxGroupInput, SelectInput, TextInput } from 'ra-ui-materialui';
import { CardContent } from '@material-ui/core';

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
            <SelectInput
                source={`fields[${index}].type`}
                label="Type"
                fullWidth
                choices={INFERENCE_TYPES}
            />
            <CheckboxGroupInput
                source={`fields[${index}].views`}
                label="Views"
                fullWidth
                choices={VIEWS}
                initialValue={VIEWS_INITIAL_VALUE}
            />
        </CardContent>
    );
};

const INFERENCE_TYPES = InferenceTypes.map(type => ({
    id: type,
    name: type,
}));

const VIEWS = [
    {
        id: 'list',
        name: 'List',
    },
    {
        id: 'edit',
        name: 'Edit',
    },
    {
        id: 'create',
        name: 'Create',
    },
    {
        id: 'show',
        name: 'Show',
    },
];

const VIEWS_INITIAL_VALUE = ['list', 'edit', 'create', 'show'];
