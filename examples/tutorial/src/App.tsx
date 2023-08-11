import { Admin, Resource, ShowGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import PostIcon from '@mui/icons-material/Book';
import UserIcon from '@mui/icons-material/Group';

import { PostList, PostEdit, PostCreate } from './posts';
import { UserList } from './users';
import { Dashboard } from './Dashboard';
import { authProvider } from './authProvider';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const App = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={dataProvider}
        dashboard={Dashboard}
    >
        <Resource
            name="posts"
            list={PostList}
            edit={PostEdit}
            create={PostCreate}
            icon={PostIcon}
        />
        <Resource
            name="users"
            list={UserList}
            show={ShowGuesser}
            icon={UserIcon}
            recordRepresentation="name"
        />
    </Admin>
);

export default App;
