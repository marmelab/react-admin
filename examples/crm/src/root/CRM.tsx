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
import {
    ConfigurationContextValue,
    ConfigurationProvider,
} from './ConfigurationContext';
import {
    defaultCompanySectors,
    defaultContactGender,
    defaultDealCategories,
    defaultDealStages,
    defaultLogo,
    defaultNoteStatuses,
    defaultTaskTypes,
    defaultTitle,
} from './defaultConfiguration';

// Define the interface for the CRM component props
interface CRMProps {
    contactGender?: ConfigurationContextValue['contactGender'];
    companySectors?: ConfigurationContextValue['companySectors'];
    darkTheme?: RaThemeOptions;
    dealCategories?: ConfigurationContextValue['dealCategories'];
    dealStages?: ConfigurationContextValue['dealStages'];
    lightTheme?: RaThemeOptions;
    logo?: ConfigurationContextValue['logo'];
    noteStatuses?: ConfigurationContextValue['noteStatuses'];
    taskTypes?: ConfigurationContextValue['taskTypes'];
    title?: ConfigurationContextValue['title'];
}

const defaultLightTheme = {
    ...defaultTheme,
    palette: {
        background: {
            default: '#fafafb',
        },
    },
};

/**
 * CRM Component
 *
 * This component sets up and renders the main CRM application using `react-admin`. It provides
 * default configurations and themes but allows for customization through props. The component
 * wraps the application with a `ConfigurationProvider` to provide configuration values via context.
 *
 * @param {Array<ContactGender>} contactGender - The gender options for contacts used in the application.
 * @param {string[]} companySectors - The list of company sectors used in the application.
 * @param {RaThemeOptions} darkTheme - The theme to use when the application is in dark mode.
 * @param {string[]} dealCategories - The categories of deals used in the application.
 * @param {DealStage[]} dealStages - The stages of deals used in the application.
 * @param {RaThemeOptions} lightTheme - The theme to use when the application is in light mode.
 * @param {string} logo - The logo used in the CRM application.
 * @param {NoteStatus[]} noteStatuses - The statuses of notes used in the application.
 * @param {string[]} taskTypes - The types of tasks used in the application.
 * @param {string} title - The title of the CRM application.
 *
 * @returns {JSX.Element} The rendered CRM application.
 *
 * @example
 * // Basic usage of the CRM component
 * import { CRM } from './CRM';
 *
 * const App = () => (
 *     <CRM
 *         logo="/path/to/logo.png"
 *         title="My Custom CRM"
 *         lightTheme={{
 *             ...defaultTheme,
 *             palette: {
 *                 primary: { main: '#0000ff' },
 *             },
 *         }}
 *     />
 * );
 *
 * export default App;
 */
export const CRM = ({
    contactGender = defaultContactGender,
    companySectors = defaultCompanySectors,
    darkTheme,
    dealCategories = defaultDealCategories,
    dealStages = defaultDealStages,
    lightTheme = defaultLightTheme,
    logo = defaultLogo,
    noteStatuses = defaultNoteStatuses,
    taskTypes = defaultTaskTypes,
    title = defaultTitle,
}: CRMProps) => (
    <ConfigurationProvider
        contactGender={contactGender}
        companySectors={companySectors}
        dealCategories={dealCategories}
        dealStages={dealStages}
        logo={logo}
        noteStatuses={noteStatuses}
        taskTypes={taskTypes}
        title={title}
    >
        <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            store={localStorageStore(undefined, 'CRM')}
            layout={Layout}
            loginPage={LoginPage}
            dashboard={Dashboard}
            theme={lightTheme}
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
    </ConfigurationProvider>
);
