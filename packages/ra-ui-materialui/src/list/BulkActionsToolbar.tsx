import * as React from 'react';
import { isValidElement, type ReactNode, useCallback } from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
    lighten,
    darken,
} from '@mui/material/styles';
import clsx from 'clsx';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslate, sanitizeListRestProps, useListContext } from 'ra-core';

import TopToolbar from '../layout/TopToolbar';
import { SelectAllButton } from '../button';

const defaultSelectAllButton = <SelectAllButton />;

export const BulkActionsToolbar = (inProps: BulkActionsToolbarProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        label = 'ra.action.bulk_actions',
        children,
        className,
        selectAllButton,
        ...rest
    } = props;
    const { selectedIds = [], onUnselectItems } = useListContext();

    const translate = useTranslate();

    const handleUnselectAllClick = useCallback(() => {
        onUnselectItems();
    }, [onUnselectItems]);

    return (
        <Root className={className}>
            <Toolbar
                data-test="bulk-actions-toolbar"
                className={clsx(BulkActionsToolbarClasses.toolbar, {
                    [BulkActionsToolbarClasses.collapsed]:
                        selectedIds.length === 0,
                })}
                {...sanitizeListRestProps(rest)}
            >
                <div className={BulkActionsToolbarClasses.title}>
                    <IconButton
                        className={BulkActionsToolbarClasses.icon}
                        aria-label={translate('ra.action.unselect')}
                        title={translate('ra.action.unselect')}
                        onClick={handleUnselectAllClick}
                        color="primary"
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <Typography
                        sx={{
                            color: theme =>
                                (theme.vars || theme).palette.text.primary,
                        }}
                        variant="body1"
                    >
                        {translate(label, {
                            _: label,
                            smart_count: selectedIds.length,
                        })}
                    </Typography>
                    {selectAllButton !== false
                        ? isValidElement(selectAllButton)
                            ? selectAllButton
                            : defaultSelectAllButton
                        : null}
                </div>
                <TopToolbar className={BulkActionsToolbarClasses.topToolbar}>
                    {children}
                </TopToolbar>
            </Toolbar>
        </Root>
    );
};

export interface BulkActionsToolbarProps {
    children?: ReactNode;
    label?: string;
    className?: string;
    selectAllButton?: ReactNode;
}

const PREFIX = 'RaBulkActionsToolbar';

export const BulkActionsToolbarClasses = {
    toolbar: `${PREFIX}-toolbar`,
    topToolbar: `${PREFIX}-topToolbar`,
    buttons: `${PREFIX}-buttons`,
    collapsed: `${PREFIX}-collapsed`,
    title: `${PREFIX}-title`,
    icon: `${PREFIX}-icon`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    position: 'relative',
    [`& .${BulkActionsToolbarClasses.toolbar}`]: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 3,
        color: (theme.vars || theme).palette.primary.contrastText,
        justifyContent: 'space-between',
        backgroundColor: theme.vars
            ? theme.vars.palette.bulkActionsToolbarBackgroundColor
            : theme.palette.mode === 'light'
              ? lighten(theme.palette.primary.light, 0.8)
              : darken(theme.palette.primary.dark, 0.5),
        minHeight: theme.spacing(6),
        height: theme.spacing(6),
        paddingRight: theme.spacing(2),
        transform: `translateY(${theme.spacing(-6)})`,
        transition: `${theme.transitions.create(
            'height'
        )}, ${theme.transitions.create(
            'min-height'
        )}, ${theme.transitions.create('transform')}`,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
    },

    [`& .${BulkActionsToolbarClasses.topToolbar}`]: {
        padding: theme.spacing(0.5),
        minHeight: 'auto',
        [theme.breakpoints.down('sm')]: {
            backgroundColor: 'transparent',
        },
    },

    [`& .${BulkActionsToolbarClasses.buttons}`]: {},

    [`& .${BulkActionsToolbarClasses.collapsed}`]: {
        minHeight: 0,
        height: 0,
        transform: `translateY(0)`,
        overflowY: 'hidden',
    },

    [`& .${BulkActionsToolbarClasses.title}`]: {
        display: 'flex',
        flex: '0 0 auto',
        alignItems: 'center',
        gap: theme.spacing(1),
    },

    [`& .${BulkActionsToolbarClasses.icon}`]: {
        marginLeft: '-0.5em',
    },
}));

declare module '@mui/material/styles' {
    interface PaletteOptions {
        bulkActionsToolbarColor?: string;
        bulkActionsToolbarBackgroundColor?: string;
    }

    interface Palette {
        bulkActionsToolbarColor: string;
        bulkActionsToolbarBackgroundColor: string;
    }

    interface ComponentNameToClassKey {
        RaBulkActionsToolbar:
            | 'root'
            | 'toolbar'
            | 'topToolbar'
            | 'buttons'
            | 'collapsed'
            | 'title'
            | 'icon';
    }

    interface ComponentsPropsList {
        RaBulkActionsToolbar: Partial<BulkActionsToolbarProps>;
    }

    interface Components {
        RaBulkActionsToolbar?: {
            defaultProps?: ComponentsPropsList['RaBulkActionsToolbar'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaBulkActionsToolbar'];
        };
    }
}
