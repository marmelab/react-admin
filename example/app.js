import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import FakeRest from './FakeRest';
import fetchMock from 'fetch-mock';
import data from './data';

import { simpleRestClient } from 'admin-on-rest';
import { Admin, Resource, Delete } from 'admin-on-rest/mui';

import PostList from './components/posts/PostList';
import PostEdit from './components/posts/PostEdit';
import PostCreate from './components/posts/PostCreate';
import PostIcon from 'material-ui/svg-icons/action/book';

import CommentList from './components/comments/CommentList';
import CommentEdit from './components/comments/CommentEdit';
import CommentCreate from './components/comments/CommentCreate';
import CommentIcon from 'material-ui/svg-icons/communication/chat-bubble';

const restServer = new FakeRest.FetchServer('http://localhost:3000');
restServer.init(data);
restServer.toggleLogging(); // logging is off by default, enable it
fetchMock.mock('^http://localhost:3000', restServer.getHandler());

render(
    <Admin restClient={simpleRestClient('http://localhost:3000')}>
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} icon={PostIcon} />
        <Resource name="comments" list={CommentList} edit={CommentEdit} create={CommentCreate} remove={Delete} icon={CommentIcon} />
    </Admin>,
    document.getElementById('root')
);
