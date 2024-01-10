import * as React from 'react';
import { useSetInspectorTitle } from 'ra-core';

import { FieldsSelector } from '../../preferences';

export const DatagridEditor = () => {
    useSetInspectorTitle('ra.inspector.Datagrid.title', { _: 'Datagrid' });

    return <FieldsSelector name="columns" availableName="availableColumns" />;
};
