import React, { createElement, Component, ComponentType, SFC } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { History } from 'history';
import createHistory from 'history/createHashHistory';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import withContext from 'recompose/withContext';

import createAdminStore from './createAdminStore';
import TranslationProvider from './i18n/TranslationProvider';
import CoreAdminRouter from './CoreAdminRouter';
import {
    AuthProvider,
    I18nProvider,
    DataProvider,
    TitleComponent,
    LoginComponent,
    LayoutComponent,
    LayoutProps,
    AdminChildren,
    CatchAllComponent,
    CustomRoutes,
    DashboardComponent,
} from './types';

export type ChildrenFunction = () => ComponentType[];

const DefaultLayout: SFC<LayoutProps> = ({ children }) => <>{children}</>;

export interface AdminProps {
    appLayout: LayoutComponent;
    authProvider?: AuthProvider;
    children?: AdminChildren;
    catchAll: CatchAllComponent;
    customSagas?: any[];
    customReducers?: object;
    customRoutes?: CustomRoutes;
    dashboard?: DashboardComponent;
    dataProvider: DataProvider;
    history: History;
    i18nProvider?: I18nProvider;
    initialState?: object;
    loading: ComponentType;
    locale?: string;
    loginPage: LoginComponent | boolean;
    logoutButton?: ComponentType;
    menu?: ComponentType;
    theme?: object;
    title?: TitleComponent;
}

interface AdminContext {
    authProvider: AuthProvider;
}

class CoreAdminBase extends Component<AdminProps> {
    static contextTypes = {
        store: PropTypes.object,
    };

    static defaultProps: Partial<AdminProps> = {
        catchAll: () => null,
        appLayout: DefaultLayout,
        loading: () => null,
        loginPage: false,
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

        if (loginPage === true && process.env.NODE_ENV !== 'production') {
            console.warn(
                'You passed true to the loginPage prop. You must either pass false to disable it or a component class to customize it'
            );
        }

        return (
            <TranslationProvider>
                <ConnectedRouter history={this.history}>
                    <Switch>
                        {loginPage !== false && loginPage !== true ? (
                            <Route
                                exact
                                path="/login"
                                render={props =>
                                    createElement(loginPage, {
                                        ...props,
                                        title,
                                        theme,
                                    })
                                }
                            />
                        ) : null}
                        <Route
                            path="/"
                            render={props => (
                                <CoreAdminRouter
                                    appLayout={appLayout}
                                    catchAll={catchAll}
                                    customRoutes={customRoutes}
                                    dashboard={dashboard}
                                    loading={loading}
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
        const {
            authProvider,
            customReducers,
            customSagas,
            dataProvider,
            i18nProvider,
            initialState,
            locale,
        } = this.props;

        return this.reduxIsAlreadyInitialized ? (
            this.renderCore()
        ) : (
            <Provider
                store={createAdminStore({
                    authProvider,
                    customReducers,
                    customSagas,
                    dataProvider,
                    i18nProvider,
                    initialState,
                    locale,
                    history: this.history,
                })}
            >
                {this.renderCore()}
            </Provider>
        );
    }
}

const CoreAdmin = withContext<AdminContext, AdminProps>(
    {
        authProvider: PropTypes.func,
    },
    ({ authProvider }) => ({ authProvider })
)(CoreAdminBase) as ComponentType<AdminProps>;

export default CoreAdmin;
