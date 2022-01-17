import * as React from 'react';
import { FieldProps, InferenceTypes, SelectInput } from 'react-admin';

export const FieldTypeInput = (props: FieldProps) => (
    <SelectInput choices={INFERENCE_TYPES} {...props} />
);

const INFERENCE_TYPES = InferenceTypes.map(type => ({
    id: type,
    name: type,
}));
