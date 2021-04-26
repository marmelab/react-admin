import React, { useMemo } from 'react';
import {
    ListContextProvider,
    useListContext,
    useListController,
} from 'ra-core';
import { Datagrid, ListProps, ListView, ListViewProps } from 'ra-ui-materialui';

import { useGetFieldDefinitions } from './useGetFieldDefinitions';
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
    const { resource, data, ids } = useListContext(props);
    const records = useMemo(() => ids.map(id => data[id]), [ids, data]);
    const definitions = useGetFieldDefinitions(resource, records);

    return (
        <ListView {...props}>
            <Datagrid rowClick="edit">
                {definitions.map(definition =>
                    getFieldFromFieldDefinition(definition)
                )}
            </Datagrid>
        </ListView>
    );
};
