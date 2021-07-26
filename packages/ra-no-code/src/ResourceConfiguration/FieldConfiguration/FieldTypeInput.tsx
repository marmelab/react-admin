import * as React from 'react';
import { InferenceTypes } from 'ra-core';
import { FieldProps, SelectInput } from 'ra-ui-materialui';

export const FieldTypeInput = (props: FieldProps) => (
    <SelectInput choices={INFERENCE_TYPES} {...props} />
);

const INFERENCE_TYPES = InferenceTypes.map(type => ({
    id: type,
    name: type,
}));
