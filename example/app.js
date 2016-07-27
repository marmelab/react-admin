import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import FakeRest from './FakeRest';
import fetchMock from 'fetch-mock';
import data from './data';

import { simpleRest } from 'admin-on-rest';
import { Admin } from 'admin-on-rest/mui';

import Layout from './components/Layout';
import PostList from './components/posts/PostList';
import PostEdit from './components/posts/PostEdit';
import PostCreate from './components/posts/PostCreate';
import CommentList from './components/comments/CommentList';
import CommentEdit from './components/comments/CommentEdit';
import CommentCreate from './components/comments/CommentCreate';

const resources = {
    posts: { list: PostList, edit: PostEdit, create: PostCreate },
    comments: { list: CommentList, edit: CommentEdit, create: CommentCreate },
};
const restServer = new FakeRest.FetchServer('http://localhost:3000');
restServer.init(data);
restServer.toggleLogging(); // logging is off by default, enable it
fetchMock.mock('^http://localhost:3000', restServer.getHandler());

render(
    <Admin resources={resources} restFlavor={simpleRest('http://localhost:3000')} appLayout={Layout} />,
    document.getElementById('root')
);
