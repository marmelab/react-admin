import { Admin, CustomRoutes, Resource, ShowGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import PostIcon from '@mui/icons-material/Book';
import UserIcon from '@mui/icons-material/Group';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';

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
        <CustomRoutes>
            <Route
                path="/segments"
                element={
                    <>
                        <Link to="path" />
                    </>
                }
            />
        </CustomRoutes>
    </Admin>
);

export default App;
