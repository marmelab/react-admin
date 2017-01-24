import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import { Admin, Resource, englishMessages } from 'admin-on-rest';
import jsonRestClient from 'aor-json-rest-client';
import { Delete } from 'admin-on-rest/mui';
import { resolveBrowserLocale } from 'admin-on-rest';
import frenchMessages from 'aor-language-french';

import { PostList, PostCreate, PostEdit, PostShow, PostIcon } from './posts';
import { CommentList, CommentEdit, CommentCreate, CommentIcon } from './comments';

import data from './data';
import * as customMessages from './i18n';

const messages = {
    fr: { ...frenchMessages, ...customMessages.fr },
    en: { ...englishMessages, ...customMessages.en },
};

const restClient = jsonRestClient(data, true);

const delayedRestClient = (type, resource, params) => new Promise(
    resolve => setTimeout(() => resolve(restClient(type, resource, params)), 1000),
);

const signInClient = (username) => {
    localStorage.setItem('username', username);
    return Promise.resolve();
};

const checkCredentials = (nextState, replace) => {
    if (!localStorage.getItem('username')) {
        replace({
            pathname: '/sign-in',
            state: { nextPathname: nextState.location.pathname },
        });
    }
};

render(
    <Admin restClient={delayedRestClient} title="Example Admin" locale={resolveBrowserLocale()} messages={messages} signInClient={signInClient} checkCredentials={checkCredentials}>
        <Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} show={PostShow} remove={Delete} icon={PostIcon} options={{ label: 'post.all' }} />
        <Resource name="comments" list={CommentList} create={CommentCreate} edit={CommentEdit} remove={Delete} icon={CommentIcon} options={{ label: 'comment.all' }} />
    </Admin>,
    document.getElementById('root'),
);
