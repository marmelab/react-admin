import * as React from 'react';
import { MouseEvent, useCallback } from 'react';
import NavigationRefresh from '@mui/icons-material/Refresh';
import { useRefresh } from 'ra-core';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';

import { Button, ButtonProps } from './Button';

export const RefreshButton = (inProps: RefreshButtonProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

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
        <StyledButton label={label} onClick={handleClick} {...rest}>
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <NavigationRefresh />;

interface Props {
    label?: string;
    icon?: React.ReactNode;
    onClick?: (e: MouseEvent) => void;
}

export type RefreshButtonProps = Props & ButtonProps;

const PREFIX = 'RaRefreshButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<RefreshButtonProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
