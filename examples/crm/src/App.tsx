import * as React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';

import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import Layout from './Layout';
import contacts from './contacts';
import companies from './companies';
import deals from './deals';
import { Dashboard } from './dashboard/Dashboard';

const App = () => (
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        layout={Layout}
        dashboard={Dashboard}
    >
        <Resource name="deals" {...deals} />
        <Resource name="contacts" {...contacts} />
        <Resource name="companies" {...companies} />
        <Resource name="contactNotes" />
        <Resource name="dealNotes" />
        <Resource name="tasks" list={ListGuesser} />
        <Resource name="sales" list={ListGuesser} />
        <Resource name="tags" list={ListGuesser} />
    </Admin>
);

export default App;
