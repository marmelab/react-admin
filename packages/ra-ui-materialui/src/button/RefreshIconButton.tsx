import * as React from 'react';
import { useCallback, ReactElement } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import NavigationRefresh from '@mui/icons-material/Refresh';
import { useRefresh, useTranslate } from 'ra-core';

export const RefreshIconButton = (props: RefreshIconButtonProps) => {
    const {
        label = 'ra.action.refresh',
        icon = defaultIcon,
        onClick,
        className,
        ...rest
    } = props;
    const refresh = useRefresh();
    const translate = useTranslate();
    const handleClick = useCallback(
        event => {
            event.preventDefault();
            refresh();
            if (typeof onClick === 'function') {
                onClick(event);
            }
        },
        [refresh, onClick]
    );

    return (
        <Tooltip title={label && translate(label, { _: 'Refresh' })}>
            <IconButton
                aria-label={label && translate(label, { _: 'Refresh' })}
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
