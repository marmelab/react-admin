import * as React from 'react';
import { Children, ReactNode, cloneElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslate, sanitizeListRestProps, useListContext } from 'ra-core';

import { ClassesOverride } from '../types';
import TopToolbar from '../layout/TopToolbar';

const useStyles = makeStyles(
    theme => ({
        toolbar: {
            zIndex: 3,
            color:
                theme.palette.type === 'light'
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
            justifyContent: 'space-between',
            backgroundColor:
                theme.palette.type === 'light'
                    ? lighten(theme.palette.primary.light, 0.85)
                    : theme.palette.primary.dark,
            minHeight: theme.spacing(8),
            height: theme.spacing(8),
            transition: `${theme.transitions.create(
                'height'
            )}, ${theme.transitions.create('min-height')}`,
        },
        topToolbar: {
            paddingTop: theme.spacing(2),
        },
        buttons: {},
        collapsed: {
            minHeight: 0,
            height: 0,
            overflowY: 'hidden',
        },
        title: {
            display: 'flex',
            flex: '0 0 auto',
        },
        icon: {
            marginLeft: '-0.5em',
            marginRight: '0.5em',
        },
    }),
    { name: 'RaBulkActionsToolbar' }
);

const BulkActionsToolbar = (props: BulkActionsToolbarProps) => {
    const {
        classes: classesOverride,
        label = 'ra.action.bulk_actions',
        children,
        ...rest
    } = props;
    const {
        basePath,
        filterValues,
        resource,
        selectedIds,
        onUnselectItems,
    } = useListContext(props);
    const classes = useStyles(props);
    const translate = useTranslate();

    return (
        <Toolbar
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
        </Toolbar>
    );
};

BulkActionsToolbar.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    label: PropTypes.string,
};

export interface BulkActionsToolbarProps {
    children?: ReactNode;
    classes?: ClassesOverride<typeof useStyles>;
    label?: string;
}

export default BulkActionsToolbar;
