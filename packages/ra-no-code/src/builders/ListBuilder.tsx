import React from 'react';
import {
    ListContextProvider,
    useListContext,
    useListController,
} from 'ra-core';
import { Datagrid, ListProps, ListView, ListViewProps } from 'ra-ui-materialui';

import { useResourceConfiguration } from '../ResourceConfiguration';
import { getFieldFromFieldDefinition } from './getFieldFromFieldDefinition';

export const ListBuilder = (props: ListProps) => {
    const controllerProps = useListController(props);

    return (
        <ListContextProvider value={controllerProps}>
            <ListBuilderView {...props} {...controllerProps} />
        </ListContextProvider>
    );
};

export const ListBuilderView = (props: Omit<ListViewProps, 'children'>) => {
    const { resource } = useListContext(props);
    const [resourceConfiguration] = useResourceConfiguration(resource);

    return (
        <ListView {...props}>
            <Datagrid rowClick="edit">
                {resourceConfiguration.fields.map(definition =>
                    getFieldFromFieldDefinition(definition)
                )}
            </Datagrid>
        </ListView>
    );
};
