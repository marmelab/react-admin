import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import FakeRest from 'fakerest';
import fetchMock from 'fetch-mock';

import { simpleRestClient, Admin, Resource } from 'admin-on-rest';
import { Delete } from 'admin-on-rest/mui';

import { PostList, PostEdit, PostCreate, PostIcon } from './posts';
import { CommentList, CommentEdit, CommentCreate, CommentIcon } from './comments';

const restServer = new FakeRest.FetchServer('http://localhost:3000');
restServer.init(require('json!./data.json'));
restServer.toggleLogging(); // logging is off by default, enable it
fetchMock.mock('^http://localhost:3000', restServer.getHandler());

const restClient = simpleRestClient('http://localhost:3000');
const delayedRestClient = (type, resource, params) => new Promise(resolve => setTimeout(() => resolve(restClient(type, resource, params)), 1000));

render(
    <Admin restClient={delayedRestClient} title="Example Admin">
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} icon={PostIcon} />
        <Resource name="comments" list={CommentList} edit={CommentEdit} create={CommentCreate} remove={Delete} icon={CommentIcon} />
    </Admin>,
    document.getElementById('root')
);
