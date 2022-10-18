import * as React from 'react';
import { useResourceContext, usePreference } from 'ra-core';

import { Configurable } from '../../preferences';
import { Datagrid, DatagridProps } from './Datagrid';
import { DatagridEditor } from './DatagridEditor';

export const DatagridConfigurable = ({
    preferenceKey,
    ...props
}: DatagridConfigurableProps) => {
    if (props.optimized) {
        throw new Error(
            'DatagridConfigurable does not support the optimized prop'
        );
    }
    const resource = useResourceContext(props);
    return (
        <Configurable
            editor={
                <DatagridEditor omit={props.omit}>
                    {props.children}
                </DatagridEditor>
            }
            preferenceKey={preferenceKey || `${resource}.datagrid`}
            sx={{
                display: 'block',
                '& .MuiBadge-root': { display: 'flex' },
                '& .RaDatagrid-root': { flex: 1 },
                '& .MuiBadge-badge': { zIndex: 2 },
            }}
        >
            <DatagridWithPreferences {...props} />
        </Configurable>
    );
};

export type DatagridConfigurableProps = DatagridProps & {
    preferenceKey?: string;
    omit?: string[];
};

const DatagridWithPreferences = ({
    children,
    omit,
    ...props
}: DatagridProps & { omit?: string[] }) => {
    const [columns] = usePreference(
        'colums',
        React.Children.map(children, child =>
            React.isValidElement(child) ? child.props.source : null
        )
            .filter(name => name != null)
            .filter(name => !omit?.includes(name))
    );
    const columnsBySource = React.Children.toArray(children).reduce(
        (acc, child) => {
            if (React.isValidElement(child)) {
                acc[child.props.source] = child;
            }
            return acc;
        },
        {}
    );

    return (
        <Datagrid {...props}>
            {columns === undefined
                ? children
                : columns.map(name => columnsBySource[name])}
        </Datagrid>
    );
};

DatagridConfigurable.propTypes = Datagrid.propTypes;
