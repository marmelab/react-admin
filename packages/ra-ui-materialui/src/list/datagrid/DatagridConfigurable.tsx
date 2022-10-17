import * as React from 'react';
import { useResourceContext, usePreference } from 'ra-core';

import { Configurable } from '../../preferences';
import { Datagrid, DatagridProps } from './Datagrid';
import { DatagridEditor } from './DatagridEditor';

export const DatagridConfigurable = ({
    preferenceKey,
    ...props
}: DatagridProps & { preferenceKey?: string; omit?: string[] }) => {
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
                React.isValidElement(child) &&
                columns.includes(child.props.source)
                    ? child
                    : null
            )}
        </Datagrid>
    );
};

DatagridConfigurable.propTypes = Datagrid.propTypes;
