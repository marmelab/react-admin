import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import { Admin, Resource, Delete, englishMessages } from 'admin-on-rest'; // eslint-disable-line import/no-unresolved
import jsonRestClient from 'aor-json-rest-client';
import frenchMessages from 'aor-language-french';

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
    >
        {permissions => [
            <Resource
                name="posts"
                key="posts"
                list={PostList}
                create={PostCreate}
                edit={PostEdit}
                show={PostShow}
                remove={Delete}
                icon={PostIcon}
            />,
            <Resource
                name="comments"
                key="comments"
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
                    key="users"
                    list={UserList}
                    create={UserCreate}
                    edit={UserEdit}
                    remove={Delete}
                    icon={UserIcon}
                    show={UserShow}
                />
            ) : null,
            <Resource name="tags" key="tags" />,
        ]}
    </Admin>,
    document.getElementById('root')
);
