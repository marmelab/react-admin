import * as React from 'react';
import { useResourceContext, usePreference } from 'ra-core';

import { Configurable } from '../../preferences';
import { Datagrid, DatagridProps } from './Datagrid';
import { DatagridEditor } from './DatagridEditor';

export const DatagridConfigurable = ({
    preferenceKey,
    ...props
}: DatagridProps & { preferenceKey?: string; omit?: string[] }) => {
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
    return (
        <Datagrid {...props}>
            {React.Children.map(children, (child, index) =>
                React.isValidElement(child) && child.props.source
                    ? columns.includes(child.props.source)
                        ? child
                        : null
                    : child
            )}
        </Datagrid>
    );
};

DatagridConfigurable.propTypes = Datagrid.propTypes;
