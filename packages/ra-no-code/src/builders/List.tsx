import React from 'react';
import { useResourceContext } from 'ra-core';
import {
    Datagrid as RaDatagrid,
    DatagridProps,
    List as RaList,
    ListProps,
} from 'ra-ui-materialui';

import { useResourceConfiguration } from '../ResourceConfiguration';
import { getFieldFromFieldDefinition } from './getFieldFromFieldDefinition';

export const List = (props: ListProps) => (
    <RaList {...props}>
        <Datagrid />
    </RaList>
);

export const Datagrid = (props: Omit<DatagridProps, 'children'>) => {
    const resource = useResourceContext(props);
    const [resourceConfiguration] = useResourceConfiguration(resource);

    return (
        <RaDatagrid rowClick="edit" {...props}>
            {resourceConfiguration.fields.map(definition =>
                getFieldFromFieldDefinition(definition)
            )}
        </RaDatagrid>
    );
};
