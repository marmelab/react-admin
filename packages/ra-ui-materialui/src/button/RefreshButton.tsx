import * as React from 'react';
import { ReactElement, MouseEvent, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import NavigationRefresh from '@material-ui/icons/Refresh';
import { refreshView } from 'ra-core';

import Button, { ButtonProps } from './Button';

const RefreshButton = (props: RefreshButtonProps) => {
    const {
        label = 'ra.action.refresh',
        icon = defaultIcon,
        onClick,
        ...rest
    } = props;
    const dispatch = useDispatch();
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
        <Button label={label} onClick={handleClick} {...rest}>
            {icon}
        </Button>
    );
};

const defaultIcon = <NavigationRefresh />;

interface Props {
    label?: string;
    icon?: ReactElement;
    onClick?: (e: MouseEvent) => void;
}

export type RefreshButtonProps = Props & ButtonProps;

RefreshButton.propTypes = {
    label: PropTypes.string,
    icon: PropTypes.element,
    onClick: PropTypes.func,
};

export default RefreshButton;
