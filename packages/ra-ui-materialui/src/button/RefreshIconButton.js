import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import NavigationRefresh from '@material-ui/icons/Refresh';
import { refreshView, useTranslate } from 'ra-core';

const defaultIcon = <NavigationRefresh />;

const RefreshIconButton = ({
    label = 'ra.action.refresh',
    icon = defaultIcon,
    onClick,
    className,
    ...rest
}) => {
    const dispatch = useDispatch();
    const translate = useTranslate();
    const handleClick = useCallback(
        event => {
            event.preventDefault();
            dispatch(refreshView());
            if (typeof onClick === 'function') {
                onClick();
            }
        },
        [dispatch, onClick]
    );

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

RefreshIconButton.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.element,
};

export default RefreshIconButton;
