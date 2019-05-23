import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { ComponentPropType } from 'ra-core';

const useStyles = makeStyles(theme => ({
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
}));

const ListToolbar = ({
    classes = {},
    filters: Filters,
    filterValues, // dynamically set via the UI by the user
    permanentFilter, // set in the List component by the developer
    actions: Actions,
    bulkActions,
    exporter,
    ...rest
}) => {
    const styles = useStyles({ classes });
    return (
        <Toolbar className={styles.toolbar}>
            {Filters &&
                <Filters {...rest}
                    filterValues={filterValues}
                    context="form"
                />
            }
            <span />
            {Actions &&
                <Actions {...rest}
                    className={styles.actions}
                    bulkActions={bulkActions}
                    exporter={exporter}
                    filters={Filters}
                    filterValues={filterValues}
                    permanentFilter={permanentFilter}
                />
            }
        </Toolbar>
    );
};

ListToolbar.propTypes = {
    classes: PropTypes.object,
    filters: ComponentPropType,
    permanentFilter: PropTypes.object,
    actions: ComponentPropType,
    bulkActions: PropTypes.oneOfType([ComponentPropType, PropTypes.bool]),
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

export default ListToolbar;
