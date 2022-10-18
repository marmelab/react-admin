import * as React from 'react';
import { usePreference, useSetInspectorTitle, useTranslate } from 'ra-core';
import { Box, Button } from '@mui/material';

import { FieldEditor } from './FieldEditor';

export const DatagridEditor = (props: {
    children: React.ReactNode;
    omit?: string[];
}) => {
    const translate = useTranslate();
    useSetInspectorTitle('ra.inspector.datagrid', { _: 'Datagrid' });
    const [columns, setColumns] = usePreference(
        'colums',
        React.Children.map(props.children, child =>
            React.isValidElement(child) ? child.props.source : null
        )
            .filter(name => name != null)
            .filter(name => !props.omit?.includes(name))
    );
    const handleToggle = event => {
        if (event.target.checked) {
            setColumns([...columns, event.target.name]);
        } else {
            setColumns(columns.filter(name => name !== event.target.name));
        }
    };
    const handleHideAll = () => {
        setColumns([]);
    };
    const handleShowAll = () => {
        setColumns(
            React.Children.map(props.children, child =>
                React.isValidElement(child) ? child.props.source : null
            ).filter(name => name != null)
        );
    };
    return (
        <div>
            {React.Children.map(props.children, child =>
                React.isValidElement(child) && child.props.source ? (
                    <FieldEditor
                        source={child.props.source}
                        label={child.props.label}
                        selected={columns.includes(child.props.source)}
                        onToggle={handleToggle}
                    />
                ) : null
            )}
            <Box display="flex" justifyContent="space-between" mx={-0.5} mt={1}>
                <Button size="small" onClick={handleHideAll}>
                    {translate('ra.inspector.datagrid.hideAll', {
                        _: 'Hide All',
                    })}
                </Button>
                <Button size="small" onClick={handleShowAll}>
                    {translate('ra.inspector.datagrid.showAll', {
                        _: 'Show All',
                    })}
                </Button>
            </Box>
        </div>
    );
};
