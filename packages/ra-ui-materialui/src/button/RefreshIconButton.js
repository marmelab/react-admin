import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import NavigationRefresh from '@material-ui/icons/Refresh';
import { refreshView, translate } from 'ra-core';

const RefreshButton = ({
    className,
    label,
    refreshView,
    translate,
    icon,
    ...rest
}) => {
    const handleClick = event => {
        const { refreshView, onClick } = this.props;
        event.preventDefault();
        refreshView();

        if (typeof onClick === 'function') {
            onClick();
        }
    };

    return (
        <Tooltip title={label && translate(label, { _: label })}>
            <IconButton
                aria-label={label && translate(label, { _: label })}
                className={className}
                color="inherit"
                onClick={handleClick}
                {...rest}
            >
                {icon}
            </IconButton>
        </Tooltip>
    );
};

RefreshButton.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    refreshView: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    icon: PropTypes.element,
};

RefreshButton.defaultProps = {
    label: 'ra.action.refresh',
    icon: <NavigationRefresh />,
};

const enhance = compose(
    connect(
        null,
        { refreshView }
    ),
    translate
);

export default enhance(RefreshButton);
