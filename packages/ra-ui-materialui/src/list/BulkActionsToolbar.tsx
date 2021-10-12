import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Children, ReactNode, cloneElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslate, sanitizeListRestProps, useListContext } from 'ra-core';

import TopToolbar from '../layout/TopToolbar';

const PREFIX = 'RaBulkActionsToolbar';

const classes = {
    toolbar: `${PREFIX}-toolbar`,
    topToolbar: `${PREFIX}-topToolbar`,
    buttons: `${PREFIX}-buttons`,
    collapsed: `${PREFIX}-collapsed`,
    title: `${PREFIX}-title`,
    icon: `${PREFIX}-icon`,
};

const Root = styled(Toolbar)(({ theme }) => ({
    [`&.${classes.toolbar}`]: {
        zIndex: 3,
        color:
            theme.palette.mode === 'light'
                ? theme.palette.primary.main
                : theme.palette.text.primary,
        justifyContent: 'space-between',
        backgroundColor:
            theme.palette.mode === 'light'
                ? alpha(theme.palette.primary.light, 0.85)
                : theme.palette.primary.dark,
        minHeight: theme.spacing(8),
        height: theme.spacing(8),
        transition: `${theme.transitions.create(
            'height'
        )}, ${theme.transitions.create('min-height')}`,
    },

    [`& .${classes.topToolbar}`]: {
        paddingTop: theme.spacing(2),
    },

    [`& .${classes.buttons}`]: {},

    [`&.${classes.toolbar}.${classes.collapsed}`]: {
        minHeight: 0,
        height: 0,
        overflowY: 'hidden',
    },

    [`& .${classes.title}`]: {
        display: 'flex',
        flex: '0 0 auto',
    },

    [`& .${classes.icon}`]: {
        marginLeft: '-0.5em',
        marginRight: '0.5em',
    },
}));

const BulkActionsToolbar = (props: BulkActionsToolbarProps) => {
    const { label = 'ra.action.bulk_actions', children, ...rest } = props;
    const {
        basePath,
        filterValues,
        resource,
        selectedIds,
        onUnselectItems,
    } = useListContext(props);

    const translate = useTranslate();

    return (
        <Root
            data-test="bulk-actions-toolbar"
            className={classnames(classes.toolbar, {
                [classes.collapsed]: selectedIds.length === 0,
            })}
            {...sanitizeListRestProps(rest)}
        >
            <div className={classes.title}>
                <IconButton
                    className={classes.icon}
                    aria-label={translate('ra.action.unselect')}
                    title={translate('ra.action.unselect')}
                    onClick={onUnselectItems}
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
            <TopToolbar className={classes.topToolbar}>
                {Children.map(children, child =>
                    isValidElement(child)
                        ? cloneElement(child, {
                              basePath,
                              filterValues,
                              resource,
                              selectedIds,
                          })
                        : null
                )}
            </TopToolbar>
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
}

export default BulkActionsToolbar;
