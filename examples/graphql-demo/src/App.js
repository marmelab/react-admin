import 'babel-polyfill';
import React, { Component } from 'react';
import { Admin, Delete, Resource } from 'react-admin';

import './App.css';

import buildApolloDataProvider from './aorApolloClient';
import authClient from './authClient';
import sagas from './sagas';
import themeReducer from './themeReducer';
import Login from './Login';
import Layout from './Layout';
import Menu from './Menu';
import { Dashboard } from './dashboard';
import customRoutes from './routes';
import translations from './i18n';

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
import { SegmentList, SegmentIcon } from './segments';

import fakeGraphQLServer from './graphqlServer';

class App extends Component {
    state = { dataProvider: null };

    async componentWillMount() {
        this.restoreFetch = fakeGraphQLServer();
        const dataProvider = await buildApolloDataProvider();
        this.setState({ dataProvider });
    }

    componentWillUnmount() {
        this.restoreFetch();
    }

    render() {
        const { dataProvider } = this.state;

        if (!dataProvider) {
            return <div>Loading</div>;
        }

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
                messages={translations}
            >
                <Resource
                    name="Customer"
                    list={VisitorList}
                    edit={VisitorEdit}
                    remove={VisitorDelete}
                    icon={VisitorIcon}
                />
                <Resource
                    name="Command"
                    list={CommandList}
                    edit={CommandEdit}
                    remove={Delete}
                    icon={CommandIcon}
                    options={{ label: 'Orders' }}
                />
                <Resource
                    name="Product"
                    list={ProductList}
                    create={ProductCreate}
                    edit={ProductEdit}
                    remove={Delete}
                    icon={ProductIcon}
                />
                <Resource
                    name="Category"
                    list={CategoryList}
                    edit={CategoryEdit}
                    remove={Delete}
                    icon={CategoryIcon}
                />
                <Resource
                    name="Review"
                    list={ReviewList}
                    edit={ReviewEdit}
                    remove={Delete}
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
