import * as React from 'react';
import { useStore, useTranslate, useResourceContext } from 'ra-core';
import {
    Box,
    Button,
    Popover,
    useMediaQuery,
    Theme,
    Tooltip,
    IconButton,
} from '@mui/material';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';

import { FieldToggle } from '../../preferences';
import { ConfigurableDatagridColumn } from './DatagridConfigurable';
import { styled } from '@mui/material/styles';

/**
 * Renders a button that lets users show / hide columns in a configurable datagrid
 *
 * @example
 * import { SelectColumnsButton, DatagridConfigurable } from 'react-admin';
 *
 * const PostListActions = () => (
 *   <TopToolbar>
        <SelectColumnsButton />
        <FilterButton />
 *   </TopToolbar>
 * );
 *
 * const PostList = () => (
 *   <List actions={<PostListActions />}>
 *     <DatagridConfigurable>
 *       <TextField source="title" />
 *       <TextField source="author" />
         ...
 *     </DatagridConfigurable>
 *   </List>
 * );
 */
export const SelectColumnsButton = props => {
    const resource = useResourceContext(props);
    const preferenceKey =
        props.preferenceKey || `preferences.${resource}.datagrid`;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
        `${preferenceKey}.availableColumns`,
        []
    );
    const [omit] = useStore<string[]>(`${preferenceKey}.omit`, []);
    const [columns, setColumns] = useStore<string[]>(
        `${preferenceKey}.columns`,
        availableColumns
            .filter(column => !omit?.includes(column.source))
            .map(column => column.index)
    );
    const translate = useTranslate();
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );

    const title = translate('ra.action.select_columns', { _: 'Columns' });

    const handleClick = (event): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const handleToggle = event => {
        if (event.target.checked) {
            // add the column at the right position
            setColumns(
                availableColumns
                    .filter(
                        column =>
                            column.index === event.target.name ||
                            columns.includes(column.index)
                    )
                    .map(column => column.index)
            );
        } else {
            setColumns(columns.filter(index => index !== event.target.name));
        }
    };

    return (
        <>
            {isXSmall ? (
                <Tooltip title={title}>
                    <IconButton
                        aria-label={title}
                        color="primary"
                        onClick={handleClick}
                        size="large"
                    >
                        <ViewWeekIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <StyledButton
                    size="small"
                    onClick={handleClick}
                    startIcon={<ViewWeekIcon />}
                >
                    {title}
                </StyledButton>
            )}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box p={1}>
                    {availableColumns.map(column => (
                        <FieldToggle
                            key={column.index}
                            source={column.source}
                            label={column.label}
                            index={column.index}
                            selected={columns.includes(column.index)}
                            onToggle={handleToggle}
                        />
                    ))}
                </Box>
            </Popover>
        </>
    );
};

const StyledButton = styled(Button, {
    name: 'RaSelectColumnsButton',
    overridesResolver: (props, styles) => styles.root,
})({
    '&.MuiButton-sizeSmall': {
        // fix for icon misalignment on small buttons, see https://github.com/mui/material-ui/pull/30240
        lineHeight: 1.5,
    },
});

export interface SelectColumnsButtonProps {
    preferenceKey: string;
}
