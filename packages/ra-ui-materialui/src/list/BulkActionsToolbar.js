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
    toolbar:
        theme.palette.type === 'light'
            ? {
                  color: theme.palette.primary.main,
                  justifyContent: 'space-between',
                  backgroundColor: lighten(theme.palette.primary.light, 0.85),
              }
            : {
                  color: theme.palette.text.primary,
                  justifyContent: 'space-between',
                  backgroundColor: theme.palette.primary.dark,
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
}) => (
    <Toolbar className={classes.toolbar} {...sanitizeListRestProps(rest)}>
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
);

BulkActionsToolbar.propTypes = {
    children: PropTypes.node,
};

BulkActionsToolbar.defaultProps = {
    label: 'ra.action.bulk_actions',
};

const enhance = compose(
    translate,
    withStyles(styles)
);

export default enhance(BulkActionsToolbar);
