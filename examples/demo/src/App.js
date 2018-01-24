import 'babel-polyfill';
import React, { Component } from 'react';
import {
    Admin,
    Delete,
    Resource,
    GET_DEFAULT_MESSAGES,
    GET_LOCALE_MESSAGES,
} from 'react-admin';

import './App.css';

import authClient from './authClient';
import sagas from './sagas';
import themeReducer from './themeReducer';
import Login from './Login';
import Layout from './Layout';
import Menu from './Menu';
import { Dashboard } from './dashboard';
import customRoutes from './routes';
import englishMessages from './i18n/en';

import {
    VisitorList,
    VisitorEdit,
    VisitorDelete,
    VisitorIcon,
} from './visitors';
import { CommandList, CommandEdit, CommandIcon } from './commands';
import {
    ProductList,
    ProductCreate,
    ProductEdit,
    ProductIcon,
} from './products';
import { CategoryList, CategoryEdit, CategoryIcon } from './categories';
import { ReviewList, ReviewEdit, ReviewIcon } from './reviews';

import dataProvider from './dataProvider';
import fakeRestServer from './restServer';

const i18nProvider = locale => {
    if (locale === 'fr') {
        return import('./i18n/fr').then(messages => messages.default);
    }

    // Always fallback on english
    return englishMessages;
};

class App extends Component {
    componentWillMount() {
        this.restoreFetch = fakeRestServer();
    }

    componentWillUnmount() {
        this.restoreFetch();
    }

    render() {
        return (
            <Admin
                title="Posters Galore Admin"
                dataProvider={dataProvider}
                customReducers={{ theme: themeReducer }}
                customSagas={sagas}
                customRoutes={customRoutes}
                authClient={authClient}
                dashboard={Dashboard}
                loginPage={Login}
                appLayout={Layout}
                menu={Menu}
                locale="en"
                i18nProvider={i18nProvider}
            >
                <Resource
                    name="customers"
                    list={VisitorList}
                    edit={VisitorEdit}
                    remove={VisitorDelete}
                    icon={VisitorIcon}
                />
                <Resource
                    name="commands"
                    list={CommandList}
                    edit={CommandEdit}
                    remove={Delete}
                    icon={CommandIcon}
                    options={{ label: 'Orders' }}
                />
                <Resource
                    name="products"
                    list={ProductList}
                    create={ProductCreate}
                    edit={ProductEdit}
                    remove={Delete}
                    icon={ProductIcon}
                />
                <Resource
                    name="categories"
                    list={CategoryList}
                    edit={CategoryEdit}
                    remove={Delete}
                    icon={CategoryIcon}
                />
                <Resource
                    name="reviews"
                    list={ReviewList}
                    edit={ReviewEdit}
                    remove={Delete}
                    icon={ReviewIcon}
                />
            </Admin>
        );
    }
}

export default App;
