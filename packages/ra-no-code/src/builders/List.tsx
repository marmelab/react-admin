import React from 'react';
import { useResourceContext } from 'ra-core';
import {
    Datagrid as RaDatagrid,
    DatagridProps,
    List as RaList,
    ListProps,
} from 'ra-ui-materialui';

import {
    useResourceConfiguration,
    useResourcesConfiguration,
} from '../ResourceConfiguration';
import { getFieldFromFieldDefinition } from './getFieldFromFieldDefinition';

export const List = (props: ListProps) => (
    <RaList {...props}>
        <Datagrid />
    </RaList>
);

export const Datagrid = (props: Omit<DatagridProps, 'children'>) => {
    const resource = useResourceContext(props);
    const [resources] = useResourcesConfiguration();
    const [resourceConfiguration] = useResourceConfiguration(resource);

    return (
        <RaDatagrid rowClick="edit" {...props}>
            {resourceConfiguration.fields
                .filter(definition => definition.views.includes('list'))
                .map(definition =>
                    getFieldFromFieldDefinition(definition, resources)
                )}
        </RaDatagrid>
    );
};
