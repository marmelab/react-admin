import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { translate, sanitizeListRestProps } from 'ra-core';

import CardActions from '../layout/CardActions';

const styles = theme => ({
    toolbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
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
        minHeight: 64,
        height: 64,
        transition: `${theme.transitions.create(
            'height'
        )}, ${theme.transitions.create('min-height')}`,
    },
    toolbarCollapsed: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 3,
        minHeight: 0,
        height: 0,
        overflowY: 'hidden',
        transition: theme.transitions.create('all'),
    },
    title: {
        flex: '0 0 auto',
    },
});

const BulkActionsToolbar = ({
    classes,
    basePath,
    filterValues,
    label,
    resource,
    selectedIds,
    translate,
    children,
    ...rest
}) =>
    selectedIds.length > 0 ? (
        <Toolbar
            data-test="bulk-actions-toolbar"
            className={classes.toolbar}
            {...sanitizeListRestProps(rest)}
        >
            <div className={classes.title}>
                <Typography color="inherit" variant="subheading">
                    {translate(label, {
                        _: label,
                        smart_count: selectedIds.length,
                    })}
                </Typography>
            </div>
            <CardActions>
                {Children.map(children, child =>
                    cloneElement(child, {
                        basePath,
                        filterValues,
                        resource,
                        selectedIds,
                    })
                )}
            </CardActions>
        </Toolbar>
    ) : (
        <Toolbar className={classes.toolbarCollapsed} />
    );

BulkActionsToolbar.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    basePath: PropTypes.string,
    filterValues: PropTypes.object,
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.array,
    translate: PropTypes.func.isRequired,
};

BulkActionsToolbar.defaultProps = {
    label: 'ra.action.bulk_actions',
};

const enhance = compose(
    translate,
    withStyles(styles)
);

export default enhance(BulkActionsToolbar);
