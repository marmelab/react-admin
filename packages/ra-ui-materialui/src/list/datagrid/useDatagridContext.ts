import { useContext, useMemo } from 'react';
import { DatagridProps } from './Datagrid';
import DatagridContext, { DatagridContextValue } from './DatagridContext';
import merge from 'lodash/merge';

export const useDatagridContext = (
    props?: DatagridProps
): DatagridContextValue => {
    const context = useContext(DatagridContext);

    return useMemo(
        () =>
            merge(
                {},
                context,
                props != null ? { isRowExpandable: props.isRowExpandable } : {}
            ),
        [context, props]
    );
};
