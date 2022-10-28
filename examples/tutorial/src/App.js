import * as React from 'react';
import PostIcon from '@mui/icons-material/Book';
import UserIcon from '@mui/icons-material/Group';
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

import { PostList, PostEdit, PostCreate, PostShow } from './posts';
import { UserList } from './users';
import Dashboard from './Dashboard';
import authProvider from './authProvider';

const App = () => (
    <Admin
        dataProvider={jsonServerProvider(
            'https://jsonplaceholder.typicode.com'
        )}
    >
        <Resource name="users" list={UserList} />
    </Admin>
);
export default App;
