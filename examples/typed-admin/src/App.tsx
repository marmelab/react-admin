import {
    Admin,
    Resource,
    ListGuesser,
    EditGuesser,
    ShowGuesser,
} from 'react-admin';
import { dataProvider } from './dataProvider';

export const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="posts"
            list={ListGuesser}
            edit={EditGuesser}
            show={ShowGuesser}
        />
        <Resource
            name="comments"
            list={ListGuesser}
            edit={EditGuesser}
            show={ShowGuesser}
        />
    </Admin>
);
