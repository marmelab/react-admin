import { useContext, useMemo } from 'react';
import { DatagridProps } from './Datagrid';
import DatagridContext, { DatagridContextValue } from './DatagridContext';
import merge from 'lodash/merge';
import { warning } from 'ra-core';

export const useDatagridContext = (
    props?: DatagridProps
): DatagridContextValue => {
    const context = useContext(DatagridContext);

    warning(
        !context,
        `useDatagridContext must be used inside a DatagridContextProvider`
    );

    return useMemo(
        () =>
            merge(
                {},
                context,
                props != null
                    ? { isRowExpandable: props.isRowExpandable }
                    : { isRowExpandable: undefined }
            ),
        [context, props]
    );
};
