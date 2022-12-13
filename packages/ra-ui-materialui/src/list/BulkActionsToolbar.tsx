import * as React from 'react';
import {
    Children,
    ReactNode,
    cloneElement,
    isValidElement,
    useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { lighten } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
    useTranslate,
    sanitizeListRestProps,
    useListContext,
    Identifier,
} from 'ra-core';

import TopToolbar from '../layout/TopToolbar';

export const BulkActionsToolbar = (props: BulkActionsToolbarProps) => {
    const {
        label = 'ra.action.bulk_actions',
        children,
        className,
        ...rest
    } = props;
    const {
        filterValues,
        resource,
        selectedIds = [],
        onUnselectItems,
    } = useListContext(props);

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
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <Typography color="inherit" variant="subtitle1">
                        {translate(label, {
                            _: label,
                            smart_count: selectedIds.length,
                        })}
                    </Typography>
                </div>
                <TopToolbar className={BulkActionsToolbarClasses.topToolbar}>
                    {Children.map(children, child =>
                        isValidElement<any>(child)
                            ? cloneElement(child, {
                                  filterValues,
                                  resource,
                                  selectedIds,
                              })
                            : null
                    )}
                </TopToolbar>
            </Toolbar>
        </Root>
    );
};

BulkActionsToolbar.propTypes = {
    children: PropTypes.node,
    label: PropTypes.string,
};

export interface BulkActionsToolbarProps {
    children?: ReactNode;
    label?: string;
    selectedIds?: Identifier[];
    className?: string;
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
        color:
            theme.palette.mode === 'light'
                ? theme.palette.primary.main
                : theme.palette.text.primary,
        justifyContent: 'space-between',
        backgroundColor:
            theme.palette.mode === 'light'
                ? lighten(theme.palette.primary.light, 0.8)
                : theme.palette.primary.dark,
        minHeight: theme.spacing(6),
        height: theme.spacing(6),
        transform: `translateY(-${theme.spacing(6)})`,
        transition: `${theme.transitions.create(
            'height'
        )}, ${theme.transitions.create(
            'min-height'
        )}, ${theme.transitions.create('transform')}`,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
    },

    [`& .${BulkActionsToolbarClasses.topToolbar}`]: {
        paddingBottom: theme.spacing(1),
        minHeight: 'auto',
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
    },

    [`& .${BulkActionsToolbarClasses.icon}`]: {
        marginLeft: '-0.5em',
        marginRight: '0.5em',
    },
}));
