/* eslint react/jsx-key: off */
import 'babel-polyfill';
import React from 'react';
import { Admin, Resource } from 'react-admin'; // eslint-disable-line import/no-unresolved
import { render } from 'react-dom';
import { Route } from 'react-router';
import authProvider from './authProvider';
import comments from './comments';
import CustomRouteLayout from './customRouteLayout';
import CustomRouteNoLayout from './customRouteNoLayout';
import dataProvider from './dataProvider';
import i18nProvider from './i18nProvider';
import posts from './posts';
import users from './users';
import {
    postQuickCreateReducer,
    postQuickCreateSaga,
} from './comments/postQuickCreate';

const customReducers = {
    postQuickCreate: postQuickCreateReducer,
};

const customSagas = [postQuickCreateSaga];

render(
    <Admin
        authProvider={authProvider}
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        title="Example Admin"
        locale="en"
        customReducers={customReducers}
        customRoutes={[
            <Route
                exact
                path="/custom"
                component={CustomRouteNoLayout}
                noLayout
            />,
            <Route exact path="/custom2" component={CustomRouteLayout} />,
        ]}
        customSagas={customSagas}
    >
        {permissions => [
            <Resource name="posts" {...posts} />,
            <Resource name="comments" {...comments} />,
            permissions ? <Resource name="users" {...users} /> : null,
            <Resource name="tags" />,
        ]}
    </Admin>,
    document.getElementById('root')
);
