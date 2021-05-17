import { useContext, useMemo } from 'react';
import { DatagridProps } from './Datagrid';
import DatagridContext, { DatagridContextValue } from './DatagridContext';
import extend from 'lodash/extend';

export const useDatagridContext = (
    props?: DatagridProps
): DatagridContextValue => {
    const context = useContext(DatagridContext);

    return useMemo(
        () =>
            extend(
                {},
                context,
                props != null ? { isRowExpandable: props.isRowExpandable } : {}
            ),
        [context, props]
    );
};
