import React, { cloneElement, Children } from 'react';
import PropTypes from 'prop-types';

import pure from 'recompose/pure';
import DashboardMenuItem from './DashboardMenuItem';

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%',
    },
};

const Menu = ({ children, hasDashboard, onMenuTap, logout }) =>
    <div style={styles.main}>
        {hasDashboard && <DashboardMenuItem onTouchTap={onMenuTap} />}
        {Children.map(children, child =>
            cloneElement(child, { context: 'menu', onMenuTap })
        )}
        {logout}
    </div>;

Menu.propTypes = {
    hasDashboard: PropTypes.bool,
    logout: PropTypes.element,
    onMenuTap: PropTypes.func,
    children: PropTypes.node.isRequired,
};

Menu.defaultProps = {
    onMenuTap: () => null,
};

export default pure(Menu);
