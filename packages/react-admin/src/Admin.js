import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import DefaultLayout from './mui/layout/Layout';
import Menu from './mui/layout/Menu';
import Login from './mui/auth/Login';
import Logout from './mui/auth/Logout';
import AdminConfig from './AdminConfig';

const Admin = ({
    appLayout,
    authClient,
    children,
    customReducers = {},
    customSagas = [],
    customRoutes = [],
    dashboard,
    history,
    locale,
    messages = {},
    menu = Menu,
    catchAll,
    dataProvider,
    theme,
    title = 'React Admin',
    loginPage,
    logoutButton,
    initialState,
}) => {
    const logout = authClient ? createElement(logoutButton || Logout) : null;

    return (
        <AdminConfig
            authClient={authClient}
            customSagas={customSagas}
            customReducers={customReducers}
            history={history}
            locale={locale}
            messages={messages}
            dataProvider={dataProvider}
            initialState={initialState}
        >
            <div>
                <Switch>
                    <Route
                        exact
                        path="/login"
                        render={({ location }) =>
                            createElement(loginPage || Login, {
                                location,
                                title,
                            })}
                    />
                    {customRoutes
                        .filter(route => route.props.noLayout)
                        .map((route, index) => (
                            <Route
                                key={index}
                                exact={route.props.exact}
                                path={route.props.path}
                                render={({ location }) => {
                                    if (route.props.render) {
                                        return route.props.render({
                                            location,
                                            title,
                                        });
                                    }
                                    if (route.props.component) {
                                        return createElement(
                                            route.props.component,
                                            {
                                                location,
                                                title,
                                            }
                                        );
                                    }
                                }}
                            />
                        ))}
                    <Route
                        path="/"
                        render={() =>
                            createElement(appLayout || DefaultLayout, {
                                children,
                                dashboard,
                                customRoutes: customRoutes.filter(
                                    route => !route.props.noLayout
                                ),
                                logout,
                                menu,
                                catchAll,
                                theme,
                                title,
                            })}
                    />
                </Switch>
            </div>
        </AdminConfig>
    );
};

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

Admin.propTypes = {
    appLayout: componentPropType,
    authClient: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    catchAll: componentPropType,
    customSagas: PropTypes.array,
    customReducers: PropTypes.object,
    customRoutes: PropTypes.array,
    dashboard: componentPropType,
    history: PropTypes.object,
    loginPage: componentPropType,
    logoutButton: componentPropType,
    menu: componentPropType,
    dataProvider: PropTypes.func,
    theme: PropTypes.object,
    title: PropTypes.node,
    locale: PropTypes.string,
    messages: PropTypes.object,
    initialState: PropTypes.object,
};

export default Admin;
