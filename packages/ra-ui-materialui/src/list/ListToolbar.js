import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles, createStyles } from '@material-ui/core/styles';

const styles = createStyles({
    toolbar: {
        justifyContent: 'space-between',
    },
});

const ListToolbar = ({
    classes,
    filters,
    filterValues, // dynamically set via the UI by the user
    permanentFilter, // set in the List component by the developer
    actions,
    bulkActions,
    exporter,
    ...rest
}) => (
    <Toolbar className={classes.toolbar}>
        {filters &&
            React.cloneElement(filters, {
                ...rest,
                filterValues,
                context: 'form',
            })}
        <span />
        {actions &&
            React.cloneElement(actions, {
                ...rest,
                className: classes.actions,
                bulkActions,
                exporter,
                filters,
                filterValues,
                permanentFilter,
                ...actions.props,
            })}
    </Toolbar>
);

ListToolbar.propTypes = {
    classes: PropTypes.object,
    filters: PropTypes.element,
    permanentFilter: PropTypes.object,
    actions: PropTypes.element,
    bulkActions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

ListToolbar.defaultProps = {
    classes: {},
};

export default withStyles(styles)(ListToolbar);
