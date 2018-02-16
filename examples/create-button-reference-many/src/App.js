import React from 'react';
import PostIcon from 'material-ui-icons/Book';

import { Admin, Resource, Delete } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { PostList, PostEdit, PostCreate, PostShow } from './posts';
import {
    CommentEdit,
    CommentCreate,
    CommentShow,
    CommentIcon,
} from './comments';

const App = () => (
    <Admin
        dataProvider={jsonServerProvider('http://jsonplaceholder.typicode.com')}
    >
        <Resource
            name="posts"
            icon={PostIcon}
            list={PostList}
            edit={PostEdit}
            create={PostCreate}
            show={PostShow}
            remove={Delete}
        />
        <Resource
            name="comments"
            create={CommentCreate}
            edit={CommentEdit}
            show={CommentShow}
            remove={Delete}
            icon={CommentIcon}
        />
    </Admin>
);
export default App;
