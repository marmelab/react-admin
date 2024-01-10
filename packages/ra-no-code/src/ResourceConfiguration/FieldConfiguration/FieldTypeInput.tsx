import * as React from 'react';
import { InferenceTypes, SelectInput, SelectInputProps } from 'react-admin';

export const FieldTypeInput = (props: SelectInputProps) => (
    <SelectInput choices={INFERENCE_TYPES} {...props} />
);

const INFERENCE_TYPES = InferenceTypes.map(type => ({
    id: type,
    name: type,
}));
