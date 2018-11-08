import React, { Component } from 'react';
import { Admin, Resource } from 'react-admin';

import './App.css';

import buildDataProvider from './dataProvider';
import authProvider from './authProvider';
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
    VisitorIcon,
    VisitorCreate,
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
import { SegmentList, SegmentIcon } from './segments';

const i18nProvider = locale => {
    if (locale === 'fr') {
        return import('./i18n/fr').then(messages => messages.default);
    }

    // Always fallback on english
    return englishMessages;
};

class App extends Component {
    state = { dataProvider: null };

    async componentWillMount() {
        const dataProvider = await buildDataProvider();
        this.setState({ dataProvider });
    }

    render() {
        const { dataProvider } = this.state;

        if (!dataProvider) {
            return (
                <div className="loader-container">
                    <div className="loader">Loading...</div>
                </div>
            );
        }

        return (
            <Admin
                title="Posters Galore Admin"
                dataProvider={dataProvider}
                customReducers={{ theme: themeReducer }}
                customSagas={sagas}
                customRoutes={customRoutes}
                authProvider={authProvider}
                dashboard={Dashboard}
                loginPage={Login}
                appLayout={Layout}
                menu={Menu}
                locale="en"
                i18nProvider={i18nProvider}
            >
                <Resource
                    name="Customer"
                    list={VisitorList}
                    create={VisitorCreate}
                    edit={VisitorEdit}
                    icon={VisitorIcon}
                />
                <Resource
                    name="Command"
                    list={CommandList}
                    edit={CommandEdit}
                    icon={CommandIcon}
                    options={{ label: 'Orders' }}
                />
                <Resource
                    name="Product"
                    list={ProductList}
                    create={ProductCreate}
                    edit={ProductEdit}
                    icon={ProductIcon}
                />
                <Resource
                    name="Category"
                    list={CategoryList}
                    edit={CategoryEdit}
                    icon={CategoryIcon}
                />
                <Resource
                    name="Review"
                    list={ReviewList}
                    edit={ReviewEdit}
                    icon={ReviewIcon}
                />
                <Resource
                    name="Segment"
                    list={SegmentList}
                    icon={SegmentIcon}
                />
                <Resource name="CommandItem" />
            </Admin>
        );
    }
}

export default App;
