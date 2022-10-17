import * as React from 'react';
import { usePreference, useSetInspectorTitle } from 'ra-core';

import { FieldEditor } from './FieldEditor';

export const DatagridEditor = (props: {
    children: React.ReactNode;
    omit?: string[];
}) => {
    useSetInspectorTitle('ra.inspector.datagrid', { _: 'Datagrid' });
    const [columns, setColumns] = usePreference(
        'colums',
        React.Children.map(props.children, child =>
            React.isValidElement(child) ? child.props.source : null
        )
            .filter(name => name != null)
            .filter(name => !props.omit?.includes(name))
    );
    const onToggle = event => {
        if (event.target.checked) {
            setColumns([...columns, event.target.name]);
        } else {
            setColumns(columns.filter(name => name !== event.target.name));
        }
    };
    return (
        <div>
            {React.Children.map(props.children, child =>
                React.isValidElement(child) ? (
                    <FieldEditor
                        source={child.props.source}
                        label={child.props.label}
                        selected={columns.includes(child.props.source)}
                        onToggle={onToggle}
                    />
                ) : null
            )}
        </div>
    );
};
