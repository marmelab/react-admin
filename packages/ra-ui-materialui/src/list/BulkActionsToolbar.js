import * as React from 'react';
import { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslate, sanitizeListRestProps } from 'ra-core';

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

const BulkActionsToolbar = props => {
    const {
        basePath,
        classes: classesOverride,
        filterValues,
        label,
        resource,
        selectedIds,
        onUnselectItems,
        children,
        ...rest
    } = props;
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
            <TopToolbar>
                {Children.map(children, child =>
                    cloneElement(Children.only(child), {
                        basePath,
                        filterValues,
                        resource,
                        selectedIds,
                    })
                )}
            </TopToolbar>
        </Toolbar>
    );
};

BulkActionsToolbar.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    basePath: PropTypes.string,
    filterValues: PropTypes.object,
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.array,
};

BulkActionsToolbar.defaultProps = {
    label: 'ra.action.bulk_actions',
};

export default BulkActionsToolbar;
