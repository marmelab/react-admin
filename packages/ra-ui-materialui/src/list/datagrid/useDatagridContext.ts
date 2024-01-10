import { useContext, useMemo } from 'react';
import { DatagridProps } from './Datagrid';
import DatagridContext, { DatagridContextValue } from './DatagridContext';
import defaults from 'lodash/defaults';

export const useDatagridContext = (
    props?: DatagridProps
): DatagridContextValue => {
    const context = useContext(DatagridContext);

    return useMemo(
        () =>
            defaults(
                {},
                props != null ? { isRowExpandable: props.isRowExpandable } : {},
                context
            ),
        [context, props]
    );
};
