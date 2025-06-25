import * as React from 'react';
import { useState } from 'react';
import { useTranslate } from 'ra-core';
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';

import { TextInput, TextInputProps } from './TextInput';

export const PasswordInput = (props: PasswordInputProps) => {
    const { initiallyVisible = false, ...rest } = useThemeProps({
        props: props,
        name: PREFIX,
    });
    const [visible, setVisible] = useState(initiallyVisible);
    const translate = useTranslate();

    const handleClick = () => {
        setVisible(!visible);
    };

    return (
        <StyledTextInput
            type={visible ? 'text' : 'password'}
            size="small"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={translate(
                                visible
                                    ? 'ra.input.password.toggle_visible'
                                    : 'ra.input.password.toggle_hidden'
                            )}
                            onClick={handleClick}
                            size="small"
                        >
                            {visible ? (
                                <Visibility fontSize="small" />
                            ) : (
                                <VisibilityOff fontSize="small" />
                            )}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            {...rest}
        />
    );
};

export interface PasswordInputProps extends TextInputProps {
    initiallyVisible?: boolean;
}

const PREFIX = 'RaPasswordInput';

const StyledTextInput = styled(TextInput, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<PasswordInputProps>;
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
