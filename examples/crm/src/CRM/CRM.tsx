import {
    Admin,
    CustomRoutes,
    ListGuesser,
    RaThemeOptions,
    Resource,
    defaultTheme,
    localStorageStore,
} from 'react-admin';

import { Route } from 'react-router';
import { CRMContextValue, CRMProvider } from './CRMContext';
import Layout from '../Layout';
import { authProvider } from '../authProvider';
import companies from '../companies';
import contacts from '../contacts';
import { Dashboard } from '../dashboard/Dashboard';
import { dataProvider } from '../dataProvider';
import deals from '../deals';
import { LoginPage } from '../login/LoginPage';
import { SignupPage } from '../login/SignupPage';
import { SettingsPage } from '../settings/SettingsPage';

// Define the interface for the CRM component props
interface CRMProps {
    apiUrl?: string;
    logo?: CRMContextValue['logo'];
    darkTheme?: RaThemeOptions;
    lightTheme?: RaThemeOptions;
    title?: CRMContextValue['title'];
    companySectors?: CRMContextValue['companySectors'];
    dealStages?: CRMContextValue['dealStages'];
    dealSteps?: string[];
    noteStatuses?: string[];
    noteTypes?: string[];
}

export const CRM = ({
    // apiUrl,
    logo,
    title,
    lightTheme,
    darkTheme,
    companySectors,
    dealStages,
    dealSteps,
    noteStatuses,
    noteTypes,
}: CRMProps) => (
    <CRMProvider
        noteStatuses={noteStatuses}
        noteTypes={noteTypes}
        dealSteps={dealSteps}
        dealStages={dealStages}
        companySectors={companySectors}
        title={title}
        logo={logo}
    >
        <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            store={localStorageStore(undefined, 'CRM')}
            layout={Layout}
            loginPage={LoginPage}
            dashboard={Dashboard}
            theme={{
                ...(lightTheme
                    ? lightTheme
                    : {
                          ...defaultTheme,
                          palette: {
                              background: {
                                  default: '#fafafb',
                              },
                          },
                      }),
            }}
            darkTheme={darkTheme || null}
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
    </CRMProvider>
);
