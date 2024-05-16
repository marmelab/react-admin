import * as React from 'react';
import { ReactElement, MouseEvent, useCallback } from 'react';
import NavigationRefresh from '@mui/icons-material/Refresh';
import { useRefresh } from 'ra-core';

import { Button, ButtonProps } from './Button';

export const RefreshButton = (props: RefreshButtonProps) => {
    const {
        label = 'ra.action.refresh',
        icon = defaultIcon,
        onClick,
        ...rest
    } = props;
    const refresh = useRefresh();
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
