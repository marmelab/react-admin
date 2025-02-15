import * as React from 'react';
import { Box } from '@mui/material';
import { Login as RaLogin, LoginForm } from 'react-admin';

const Login = () => (
    <RaLogin sx={{ background: 'none' }}>
        <Box sx={{ textAlign: 'center', color: 'text.disabled' }}>
            Hint: demo / demo
        </Box>
        <LoginForm />
    </RaLogin>
);

export default Login;
