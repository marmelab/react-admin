import React from 'react';
import PostIcon from 'material-ui-icons/Book';
import UserIcon from 'material-ui-icons/Group';

import { Admin, Resource, Delete } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { PostList, PostEdit, PostCreate, PostShow } from './posts';
import { UserList } from './users';
import Dashboard from './Dashboard';
import authClient from './authClient';

const App = () => (
    <Admin dataProvider={jsonServerProvider('http://jsonplaceholder.typicode.com')} authClient={authClient}>
        <Resource name="posts" icon={PostIcon} list={PostList} edit={PostEdit} create={PostCreate} show={PostShow} remove={Delete} />
        <Resource name="users" icon={UserIcon} list={UserList} />
    </Admin>
);
export default App;
