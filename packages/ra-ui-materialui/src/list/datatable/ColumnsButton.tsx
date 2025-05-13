import * as React from 'react';
import { useTranslate, useResourceContext } from 'ra-core';
import {
    Box,
    Button,
    type ButtonProps,
    Menu,
    useMediaQuery,
    Theme,
    Tooltip,
    IconButton,
} from '@mui/material';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';

/**
 * Renders a button that lets users show / hide columns in a DataTable
 *
 * @example
 * import { ColumnsButton, DataTable } from 'react-admin';
 *
 * const PostListActions = () => (
 *   <TopToolbar>
        <ColumnsButton />
        <FilterButton />
 *   </TopToolbar>
 * );
 *
 * const PostList = () => (
 *   <List actions={<PostListActions />}>
 *     <DataTable>
 *       <DataTable.Col source="title" />
 *       <DataTable.Col source="author" />
         ...
 *     </DataTable>
 *   </List>
 * );
 */
export const ColumnsButton = (inProps: ColumnsButtonProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const resource = useResourceContext(props);
    const storeKey = props.storeKey || `${resource}.datatable`;

    const [anchorEl, setAnchorEl] = React.useState(null);

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

    return (
        <Root>
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
                <Button
                    size="small"
                    onClick={handleClick}
                    startIcon={<ViewWeekIcon />}
                    {...sanitizeRestProps(props)}
                >
                    {title}
                </Button>
            )}
            <Menu
                open={Boolean(anchorEl)}
                keepMounted
                anchorEl={anchorEl}
                onClose={handleClose}
            >
                {/* ColumnsSelector will be rendered here via Portal  */}
                <Box
                    component="ul"
                    sx={{ px: 1, my: 0, minWidth: 200 }}
                    id={`${storeKey}-columnsSelector`}
                />
            </Menu>
        </Root>
    );
};

const PREFIX = 'RaColumnsButton';
const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    '& .MuiButton-sizeSmall': {
        // fix for icon misalignment on small buttons, see https://github.com/mui/material-ui/pull/30240
        lineHeight: 1.5,
    },
});

const sanitizeRestProps = ({
    resource,
    storeKey,
    ...rest
}: ColumnsButtonProps): ButtonProps => rest;

export interface ColumnsButtonProps extends ButtonProps {
    resource?: string;
    storeKey?: string;
}

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaColumnsButton: 'root';
    }

    interface ComponentsPropsList {
        RaColumnsButton: Partial<ColumnsButtonProps>;
    }

    interface Components {
        RaColumnsButton?: {
            defaultProps?: ComponentsPropsList['RaColumnsButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaColumnsButton'];
        };
    }
}
