import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import { Admin, Resource, englishMessages, resolveBrowserLocale } from 'admin-on-rest';
import jsonRestClient from 'aor-json-rest-client';
import { Delete } from 'admin-on-rest/mui';
import frenchMessages from 'aor-language-french';

import addUploadFeature from './addUploadFeature';

import { PostList, PostCreate, PostEdit, PostShow, PostIcon } from './posts';
import { CommentList, CommentEdit, CommentCreate, CommentIcon } from './comments';

import data from './data';
import * as customMessages from './i18n';

const messages = {
    fr: { ...frenchMessages, ...customMessages.fr },
    en: { ...englishMessages, ...customMessages.en },
};

const restClient = jsonRestClient(data, true);
const uploadCapableClient = addUploadFeature(restClient);
const delayedRestClient = (type, resource, params) => new Promise(resolve => setTimeout(() => resolve(uploadCapableClient(type, resource, params)), 1000));

render(
    <Admin restClient={delayedRestClient} title="Example Admin" locale={resolveBrowserLocale()} messages={messages}>
        <Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} show={PostShow} remove={Delete} icon={PostIcon} />
        <Resource name="comments" list={CommentList} create={CommentCreate} edit={CommentEdit} remove={Delete} icon={CommentIcon} />
    </Admin>,
    document.getElementById('root'),
);
