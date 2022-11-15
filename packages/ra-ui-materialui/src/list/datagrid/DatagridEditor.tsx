import * as React from 'react';
import { useSetInspectorTitle } from 'ra-core';

import { FieldsSelector } from '../../preferences';

export const DatagridEditor = () => {
    useSetInspectorTitle('ra.inspector.datagrid', { _: 'Datagrid' });

    return <FieldsSelector name="columns" availableName="availableColumns" />;
};
