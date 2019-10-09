import React from 'react';
import { Login } from 'react-admin';

import LoginForm from './LoginForm';

const LoginPage = (props) => <Login {...props} loginForm={<LoginForm />} />;

export default LoginPage;
