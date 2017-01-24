import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import { Admin, Resource } from 'admin-on-rest';
import jsonRestClient from 'aor-json-rest-client';
import { Delete } from 'admin-on-rest/mui';
import { resolveBrowserLocale } from 'admin-on-rest';

import { PostList, PostCreate, PostEdit, PostShow, PostIcon } from './posts';
import { CommentList, CommentEdit, CommentCreate, CommentIcon } from './comments';

import data from './data';
import * as messages from './i18n';

const restClient = jsonRestClient(data, true);

const delayedRestClient = (type, resource, params) => new Promise(
    resolve => setTimeout(() => resolve(restClient(type, resource, params)), 1000),
);

render(
    <Admin restClient={delayedRestClient} title="Example Admin" locale={resolveBrowserLocale()} messages={messages}>
        <Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} show={PostShow} remove={Delete} icon={PostIcon} options={{ label: 'post.all' }} />
        <Resource name="comments" list={CommentList} create={CommentCreate} edit={CommentEdit} remove={Delete} icon={CommentIcon} options={{ label: 'comment.all' }} />
    </Admin>,
    document.getElementById('root'),
);
