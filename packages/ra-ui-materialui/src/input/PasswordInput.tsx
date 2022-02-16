import * as React from 'react';
import { useState } from 'react';
import { useTranslate } from 'ra-core';
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { TextInput, TextInputProps } from './TextInput';

export const PasswordInput = (props: PasswordInputProps) => {
    const { initiallyVisible = false, ...rest } = props;
    const [visible, setVisible] = useState(initiallyVisible);
    const translate = useTranslate();

    const handleClick = () => {
        setVisible(!visible);
    };

    return (
        <TextInput
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
                            size="large"
                        >
                            {visible ? <Visibility /> : <VisibilityOff />}
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
