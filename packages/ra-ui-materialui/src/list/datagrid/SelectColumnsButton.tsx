import * as React from 'react';
import { useStore, useTranslate, useResourceContext } from 'ra-core';
import {
    Box,
    Button,
    type ButtonProps,
    Popover,
    useMediaQuery,
    Theme,
    Tooltip,
    IconButton,
} from '@mui/material';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';

import { FieldToggle } from '../../preferences';
import { ConfigurableDatagridColumn } from './DatagridConfigurable';

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
export const SelectColumnsButton = (inProps: SelectColumnsButtonProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const { preferenceKey } = props;

    const resource = useResourceContext(props);
    const finalPreferenceKey = preferenceKey || `${resource}.datagrid`;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [availableColumns, setAvailableColumns] = useStore<
        ConfigurableDatagridColumn[]
    >(`preferences.${finalPreferenceKey}.availableColumns`, []);
    const [omit] = useStore<string[]>(
        `preferences.${finalPreferenceKey}.omit`,
        []
    );
    const [columns, setColumns] = useStore<string[]>(
        `preferences.${finalPreferenceKey}.columns`,
        availableColumns
            .filter(column =>
                column.source ? !omit?.includes(column.source) : true
            )
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

    const handleMove = (index1, index2) => {
        const index1Pos = availableColumns.findIndex(
            // eslint-disable-next-line eqeqeq
            field => field.index == index1
        );
        const index2Pos = availableColumns.findIndex(
            // eslint-disable-next-line eqeqeq
            field => field.index == index2
        );
        if (index1Pos === -1 || index2Pos === -1) {
            return;
        }
        let newAvailableColumns;
        if (index1Pos > index2Pos) {
            newAvailableColumns = [
                ...availableColumns.slice(0, index2Pos),
                availableColumns[index1Pos],
                ...availableColumns.slice(index2Pos, index1Pos),
                ...availableColumns.slice(index1Pos + 1),
            ];
        } else {
            newAvailableColumns = [
                ...availableColumns.slice(0, index1Pos),
                ...availableColumns.slice(index1Pos + 1, index2Pos + 1),
                availableColumns[index1Pos],
                ...availableColumns.slice(index2Pos + 1),
            ];
        }
        setAvailableColumns(newAvailableColumns);
        setColumns(columns =>
            newAvailableColumns
                .filter(column => columns.includes(column.index))
                .map(column => column.index)
        );
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
                        {...sanitizeRestProps(props)}
                    >
                        <ViewWeekIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <StyledButton
                    size="small"
                    onClick={handleClick}
                    startIcon={<ViewWeekIcon />}
                    {...sanitizeRestProps(props)}
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
                <Box
                    component="ul"
                    sx={{
                        p: 1,
                        my: 0,
                    }}
                >
                    {availableColumns.map(column => (
                        <FieldToggle
                            key={column.index}
                            source={column.source!}
                            label={column.label!}
                            index={column.index!}
                            selected={columns.includes(column.index)}
                            onToggle={handleToggle}
                            onMove={handleMove}
                        />
                    ))}
                </Box>
            </Popover>
        </>
    );
};
const PREFIX = 'RaSelectColumnsButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    '&.MuiButton-sizeSmall': {
        // fix for icon misalignment on small buttons, see https://github.com/mui/material-ui/pull/30240
        lineHeight: 1.5,
    },
});

const sanitizeRestProps = ({
    resource,
    preferenceKey,
    ...rest
}: SelectColumnsButtonProps): ButtonProps => rest;

export interface SelectColumnsButtonProps extends ButtonProps {
    resource?: string;
    preferenceKey?: string;
}

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaSelectColumnsButton: 'root';
    }

    interface ComponentsPropsList {
        RaSelectColumnsButton: Partial<SelectColumnsButtonProps>;
    }

    interface Components {
        RaSelectColumnsButton?: {
            defaultProps?: ComponentsPropsList['RaSelectColumnsButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaSelectColumnsButton'];
        };
    }
}
