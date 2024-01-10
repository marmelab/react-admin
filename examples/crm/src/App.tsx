import {
    Admin,
    ListGuesser,
    Resource,
    defaultTheme,
    localStorageStore,
} from 'react-admin';

import Layout from './Layout';
import { authProvider } from './authProvider';
import companies from './companies';
import contacts from './contacts';
import { Dashboard } from './dashboard/Dashboard';
import { dataProvider } from './dataProvider';
import deals from './deals';

const App = () => (
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        store={localStorageStore(undefined, 'CRM')}
        layout={Layout}
        dashboard={Dashboard}
        theme={{
            ...defaultTheme,
            palette: {
                background: {
                    default: '#fafafb',
                },
            },
        }}
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
