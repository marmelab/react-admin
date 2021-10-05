import * as React from 'react';
import { useCallback, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import NavigationRefresh from '@mui/icons-material/Refresh';
import { refreshView, useTranslate } from 'ra-core';

const RefreshIconButton = (props: RefreshIconButtonProps) => {
    const {
        label = 'ra.action.refresh',
        icon = defaultIcon,
        onClick,
        className,
        ...rest
    } = props;
    const dispatch = useDispatch();
    const translate = useTranslate();
    const handleClick = useCallback(
        event => {
            event.preventDefault();
            dispatch(refreshView());
            if (typeof onClick === 'function') {
                onClick(event);
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

const defaultIcon = <NavigationRefresh />;

interface Props {
    className?: string;
    icon?: ReactElement;
    label?: string;
    onClick?: (e: MouseEvent) => void;
}

export type RefreshIconButtonProps = Props & IconButtonProps;

RefreshIconButton.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.element,
};

export default RefreshIconButton;
