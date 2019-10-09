import './index.css'
import React from 'react';
import ReactDOM from 'react-dom';
import { Admin, Resource, ListGuesser, AppBar, Layout } from 'react-admin';

import dataProvider from './dataProvider';
import authProvider from './authProvider';
import LoginPage from './LoginPage'
import CustomUserMenu from './CustomUserMenu'

const MyAppBar = props => <AppBar {...props} userMenu={<CustomUserMenu />} />;
const MyLayout = props => <Layout {...props} appBar={MyAppBar} />;


ReactDOM.render(
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={LoginPage}
        appLayout={MyLayout}
    >
        <Resource name="resource" list={ListGuesser} />
        <Resource name="profile" />
    </Admin>,
    document.getElementById('root'));
