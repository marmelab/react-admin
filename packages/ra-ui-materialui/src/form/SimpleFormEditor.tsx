import * as React from 'react';
import { useSetInspectorTitle } from 'ra-core';

import { FieldsSelector } from '../preferences';

export const SimpleFormEditor = () => {
    useSetInspectorTitle('ra.configurable.SimpleForm.title', { _: 'Form' });

    return <FieldsSelector name="inputs" availableName="availableInputs" />;
};
