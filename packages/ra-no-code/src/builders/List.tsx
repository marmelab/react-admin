import React from 'react';
import {
    Datagrid as RaDatagrid,
    DatagridProps,
    List as RaList,
    useResourceContext,
} from 'react-admin';

import {
    useResourceConfiguration,
    useResourcesConfiguration,
} from '../ResourceConfiguration';
import { getFieldFromFieldDefinition } from './getFieldFromFieldDefinition';

export const List = () => (
    <RaList>
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
