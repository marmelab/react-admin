import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    theme => ({
        toolbar: {
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingRight: 0,
            [theme.breakpoints.up('xs')]: {
                paddingLeft: 0,
            },
            [theme.breakpoints.down('xs')]: {
                paddingLeft: theme.spacing(2),
                backgroundColor: theme.palette.background.paper,
            },
        },
        actions: {
            paddingTop: theme.spacing(3),
            minHeight: theme.spacing(5),
            [theme.breakpoints.down('xs')]: {
                padding: theme.spacing(1),
                backgroundColor: theme.palette.background.paper,
            },
        },
    }),
    { name: 'RaListToolbar' }
);

const defaultClasses = {}; // avoid needless updates

const ListToolbar = ({
    classes = defaultClasses,
    filters,
    filterValues, // dynamically set via the UI by the user
    permanentFilter, // set in the List component by the developer
    actions,
    exporter,
    ...rest
}) => {
    const styles = useStyles({ classes });
    return (
        <Toolbar className={styles.toolbar}>
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
                    className: styles.actions,
                    exporter,
                    filters,
                    filterValues,
                    permanentFilter,
                    ...actions.props,
                })}
        </Toolbar>
    );
};

ListToolbar.propTypes = {
    classes: PropTypes.object,
    filters: PropTypes.element,
    permanentFilter: PropTypes.object,
    actions: PropTypes.element,
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

export default React.memo(ListToolbar);
