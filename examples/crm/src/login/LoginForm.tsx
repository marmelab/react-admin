import * as React from 'react';
import { CardActions, Typography } from '@mui/material';
import {
    Login,
    LoginForm as RaLoginForm,
    TextInput,
    PasswordInput,
    required,
} from 'react-admin';
import { Link } from 'react-router-dom';

export const LoginForm = () => (
    <Login>
        <RaLoginForm
            sx={{
                '& .RaLoginForm-content': {
                    paddingBottom: 1,
                },
            }}
        >
            <TextInput
                autoFocus
                source="email"
                label="Email"
                autoComplete="email"
                type="email"
                validate={required()}
            />
            <PasswordInput
                source="password"
                label="Password"
                autoComplete="current-password"
                validate={required()}
            />
        </RaLoginForm>
        <CardActions sx={{ justifyContent: 'center' }}>
            <Typography component={Link} to="/reset-password" variant="caption">
                Forgot your password?
            </Typography>
        </CardActions>
    </Login>
);
