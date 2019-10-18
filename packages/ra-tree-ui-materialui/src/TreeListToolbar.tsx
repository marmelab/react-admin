import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles, createStyles } from '@material-ui/core/styles';

const styles = createStyles({
    toolbar: {
        justifyContent: 'space-between',
    },
});

const TreeListToolbar = ({
    classes,
    filters,
    permanentFilter, // set in the List component by the developer
    actions,
    exporter,
    ...rest
}) => (
    <Toolbar className={classes.toolbar}>
        <span />
        {actions &&
            React.cloneElement(actions, {
                ...rest,
                className: classes.actions,
                exporter,
                permanentFilter,
                ...actions.props,
            })}
    </Toolbar>
);

TreeListToolbar.propTypes = {
    classes: PropTypes.object,
    permanentFilter: PropTypes.object,
    actions: PropTypes.element,
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

TreeListToolbar.defaultProps = {
    classes: {},
};

export default withStyles(styles)(TreeListToolbar);
