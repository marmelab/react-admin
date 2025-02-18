import * as React from 'react';
import { required, useTranslate } from 'ra-core';

import { Login, LoginProps } from './Login';
import { PasswordInput, TextInput } from '../input';
import { LoginForm } from './LoginForm';

export const LoginWithEmail = (props: LoginProps) => {
    const translate = useTranslate();
    return (
        <Login {...props}>
            <LoginForm>
                <TextInput
                    autoFocus
                    source="email"
                    label={translate('ra.auth.email', { _: 'Email' })}
                    autoComplete="email"
                    type="email"
                    validate={required()}
                />
                <PasswordInput
                    source="password"
                    label={translate('ra.auth.password', { _: 'Password' })}
                    autoComplete="current-password"
                    validate={required()}
                />
            </LoginForm>
        </Login>
    );
};
