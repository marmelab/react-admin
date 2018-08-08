import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import withContext from 'recompose/withContext';

import createAdminStore from './createAdminStore';
import TranslationProvider from './i18n/TranslationProvider';
import CoreAdminRouter from './CoreAdminRouter';

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

class CoreAdmin extends React.Component {
    static propTypes = {
        appLayout: componentPropType,
        authProvider: PropTypes.func,
        children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
        catchAll: componentPropType,
        customSagas: PropTypes.array,
        customReducers: PropTypes.object,
        customRoutes: PropTypes.array,
        dashboard: componentPropType,
        dataProvider: PropTypes.func,
        history: PropTypes.object,
        i18nProvider: PropTypes.func,
        initialState: PropTypes.object,
        loading: componentPropType,
        locale: PropTypes.string,
        loginPage: componentPropType,
        logoutButton: componentPropType,
        menu: componentPropType,
        theme: PropTypes.object,
        title: PropTypes.node,
    };

    static contextTypes = {
        store: PropTypes.object,
    };

    reduxIsAlreadyInitialized = false;
    history = null;

    constructor(props, context) {
        super(props, context);
        if (context.store) {
            this.reduxIsAlreadyInitialized = true;
            if (!props.history) {
                throw new Error(`Missing history prop.
When integrating react-admin inside an existing redux Provider, you must provide the same 'history' prop to the <Admin> as the one used to bootstrap your routerMiddleware.
React-admin uses this history for its own ConnectedRouter.`);
            }
            this.history = props.history;
        } else {
            if (!props.dataProvider) {
                throw new Error(`Missing dataProvider prop.
React-admin requires a valid dataProvider function to work.`);
            }
            this.history = props.history || createHistory();
        }
    }

    renderCore() {
        const {
            appLayout,
            authProvider,
            children,
            customRoutes = [],
            dashboard,
            menu, // deprecated, use a custom layout instead
            catchAll,
            theme,
            title = 'React Admin',
            loading,
            loginPage,
            logoutButton,
        } = this.props;

        const logout = authProvider ? createElement(logoutButton) : null;

        return (
            <TranslationProvider>
                <ConnectedRouter history={this.history}>
                    <Switch>
                        <Route
                            exact
                            path="/login"
                            render={props =>
                                createElement(loginPage, {
                                    ...props,
                                    title,
                                })
                            }
                        />
                        <Route
                            path="/"
                            render={props => (
                                <CoreAdminRouter
                                    appLayout={appLayout}
                                    catchAll={catchAll}
                                    customRoutes={customRoutes}
                                    dashboard={dashboard}
                                    loading={loading}
                                    loginPage={loginPage}
                                    logout={logout}
                                    menu={menu}
                                    theme={theme}
                                    title={title}
                                    {...props}
                                >
                                    {children}
                                </CoreAdminRouter>
                            )}
                        />
                    </Switch>
                </ConnectedRouter>
            </TranslationProvider>
        );
    }

    render() {
        return this.reduxIsAlreadyInitialized ? (
            this.renderCore()
        ) : (
            <Provider
                store={createAdminStore({
                    ...this.props,
                    history: this.history,
                })}
            >
                {this.renderCore()}
            </Provider>
        );
    }
}

export default withContext(
    {
        authProvider: PropTypes.func,
    },
    ({ authProvider }) => ({ authProvider })
)(CoreAdmin);
