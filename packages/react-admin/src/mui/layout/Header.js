import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import ViewTitle from './ViewTitle';

const styles = {
    root: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export const Header = ({ classes, title, actions, actionProps }) => (
    <div className={classes.root}>
        <ViewTitle title={title} />
        {actions && React.cloneElement(actions, actionProps)}
    </div>
);

Header.propTypes = {
    classes: PropTypes.object,
    title: PropTypes.any,
    actions: PropTypes.element,
    actionProps: PropTypes.object,
};

export default withStyles(styles)(Header);
