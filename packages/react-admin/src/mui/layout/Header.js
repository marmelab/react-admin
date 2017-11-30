import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Responsive from '../../mui/layout/Responsive';
import ViewTitle from './ViewTitle';

const styles = {
    root: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export const Header = ({
    classes,
    title,
    mobileActions,
    actions,
    actionProps,
}) => (
    <Responsive
        small={
            <div className={classes.root}>
                <ViewTitle
                    title={title}
                    mobileActions={mobileActions}
                    actionProps={actionProps}
                />
            </div>
        }
        medium={
            <div className={classes.root}>
                <ViewTitle title={title} />
                {actions && React.cloneElement(actions, actionProps)}
            </div>
        }
    />
);

Header.propTypes = {
    classes: PropTypes.object,
    title: PropTypes.any,
    mobileActions: PropTypes.element,
    actions: PropTypes.element,
    actionProps: PropTypes.object,
};

export default withStyles(styles)(Header);
