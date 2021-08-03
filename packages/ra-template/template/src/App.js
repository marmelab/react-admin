import React from 'react';
import {
    Admin,
    Resource,
    ListGuesser,
    EditGuesser,
    ShowGuesser,
} from 'react-admin';
import dataProvider from './dataProvider';

function App() {
    return (
        <Admin dataProvider={dataProvider}>
            <Resource
                name="posts"
                list={ListGuesser}
                edit={EditGuesser}
                show={ShowGuesser}
            />
            <Resource
                name="users"
                list={ListGuesser}
                edit={EditGuesser}
                show={ShowGuesser}
            />
        </Admin>
    );
}

export default App;
