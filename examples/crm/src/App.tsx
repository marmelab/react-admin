import {
    Admin,
    CustomRoutes,
    ListGuesser,
    Resource,
    defaultTheme,
    localStorageStore,
} from 'react-admin';

import { Route } from 'react-router';
import Layout from './Layout';
import { authProvider } from './authProvider';
import companies from './companies';
import contacts from './contacts';
import { Dashboard } from './dashboard/Dashboard';
import { dataProvider } from './dataProvider';
import deals from './deals';
import { LoginPage } from './login/LoginPage';
import { SignupPage } from './login/SignupPage';
import sales from './sales';
import { SettingsPage } from './settings/SettingsPage';

const App = () => (
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        store={localStorageStore(undefined, 'CRM')}
        layout={Layout}
        loginPage={LoginPage}
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
        <CustomRoutes noLayout>
            <Route path={SignupPage.path} element={<SignupPage />} />
        </CustomRoutes>
        <CustomRoutes>
            <Route path={SettingsPage.path} element={<SettingsPage />} />
        </CustomRoutes>
        <Resource name="deals" {...deals} />
        <Resource name="contacts" {...contacts} />
        <Resource name="companies" {...companies} />
        <Resource name="sales" {...sales} />
        <Resource name="contactNotes" />
        <Resource name="dealNotes" />
        <Resource name="tasks" list={ListGuesser} />
        <Resource
            name="sales"
            list={ListGuesser}
            recordRepresentation={(record: any) =>
                `${record.first_name} ${record.last_name}`
            }
        />
        <Resource name="tags" list={ListGuesser} />
    </Admin>
);

export default App;
