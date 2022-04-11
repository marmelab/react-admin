/* eslint react/jsx-key: off */
import * as React from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin'; // eslint-disable-line import/no-unresolved
import { render } from 'react-dom';
import { Route, Routes, BrowserRouter, Link } from 'react-router-dom';

import authProvider from './authProvider';
import comments from './comments';
import CustomRouteLayout from './customRouteLayout';
import CustomRouteNoLayout from './customRouteNoLayout';
import dataProvider from './dataProvider';
import i18nProvider from './i18nProvider';
import Layout from './Layout';
import posts from './posts';
import users from './users';
import tags from './tags';

const App = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        title="Example Admin"
        layout={Layout}
        basename="admintest"
    >
        <CustomRoutes noLayout>
            <Route
                path="/custom"
                element={<CustomRouteNoLayout title="Posts from /custom" />}
            />
        </CustomRoutes>
        <Resource name="posts" {...posts} />
        <Resource name="comments" {...comments} />
        <Resource name="tags" {...tags} />
        {permissions => (
            <>
                {permissions ? <Resource name="users" {...users} /> : null}
                <CustomRoutes noLayout>
                    <Route
                        path="/custom1"
                        element={
                            <CustomRouteNoLayout title="Posts from /custom1" />
                        }
                    />
                </CustomRoutes>
                <CustomRoutes>
                    <Route
                        path="/custom2"
                        element={
                            <CustomRouteLayout title="Posts from /custom2" />
                        }
                    />
                </CustomRoutes>
            </>
        )}
        <CustomRoutes>
            <Route
                path="/custom3"
                element={<CustomRouteLayout title="Posts from /custom3" />}
            />
        </CustomRoutes>
    </Admin>
);

const Index = () => (
    <nav>
        <ul>
            <li>
                <Link to="/">Index</Link>
            </li>
            <li>
                <Link to="/otherapp">OtherApp</Link>
            </li>
            <li>
                <Link to="/admintest">Admintest</Link>
            </li>
        </ul>
    </nav>
);

render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<Index />} />
                <Route path="/otherapp" element={<h1>Other App</h1>} />
                <Route path="/admintest/*" element={<App />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
