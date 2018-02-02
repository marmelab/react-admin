/* eslint react/jsx-key: off */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import { Admin, Resource, Delete, englishMessages } from 'admin-on-rest'; // eslint-disable-line import/no-unresolved
import jsonRestClient from 'aor-json-rest-client';
import frenchMessages from 'aor-language-french';
import { Route } from 'react-router';

import addUploadFeature from './addUploadFeature';

import { PostList, PostCreate, PostEdit, PostShow, PostIcon } from './posts';
import {
    CommentList,
    CommentEdit,
    CommentCreate,
    CommentShow,
    CommentIcon,
} from './comments';
import { UserList, UserEdit, UserCreate, UserIcon, UserShow } from './users';
import CustomRouteNoLayout from './customRouteNoLayout';
import CustomRouteLayout from './customRouteLayout';
import data from './data';
import * as customMessages from './i18n';
import authClient from './authClient';

const messages = {
    fr: { ...frenchMessages, ...customMessages.fr },
    en: { ...englishMessages, ...customMessages.en },
};

const restClient = jsonRestClient(data, true);
const uploadCapableClient = addUploadFeature(restClient);
const delayedRestClient = (type, resource, params) =>
    new Promise(resolve =>
        setTimeout(
            () => resolve(uploadCapableClient(type, resource, params)),
            1000
        )
    );

render(
    <Admin
        authClient={authClient}
        restClient={delayedRestClient}
        title="Example Admin"
        locale="en"
        messages={messages}
        customRoutes={[
            <Route
                exact
                path="/custom"
                component={CustomRouteNoLayout}
                noLayout
            />,
            <Route exact path="/custom2" component={CustomRouteLayout} />,
        ]}
    >
        {permissions => [
            <Resource
                name="posts"
                list={PostList}
                create={PostCreate}
                edit={PostEdit}
                show={PostShow}
                remove={Delete}
                icon={PostIcon}
            />,
            <Resource
                name="comments"
                list={CommentList}
                create={CommentCreate}
                edit={CommentEdit}
                show={CommentShow}
                remove={Delete}
                icon={CommentIcon}
            />,
            permissions ? (
                <Resource
                    name="users"
                    list={UserList}
                    create={UserCreate}
                    edit={UserEdit}
                    remove={Delete}
                    icon={UserIcon}
                    show={UserShow}
                />
            ) : null,
            <Resource name="tags" />,
        ]}
    </Admin>,
    document.getElementById('root')
);
