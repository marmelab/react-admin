import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavigationRefresh from '@material-ui/icons/Refresh';
import { refreshView as refreshViewAction } from 'ra-core';

import Button from './Button';

const RefreshButton = ({ label, refreshView, icon, onClick, ...rest }) => {
    const handleClick = event => {
        event.preventDefault();
        refreshView();

        if (typeof onClick === 'function') {
            onClick();
        }
    };

    return (
        <Button label={label} onClick={handleClick} {...rest}>
            {icon}
        </Button>
    );
};

RefreshButton.propTypes = {
    label: PropTypes.string,
    refreshView: PropTypes.func.isRequired,
    icon: PropTypes.element,
};

RefreshButton.defaultProps = {
    label: 'ra.action.refresh',
    icon: <NavigationRefresh />,
};

const enhance = connect(
    null,
    { refreshView: refreshViewAction }
);

export default enhance(RefreshButton);
