import polyglotI18nProvider from 'ra-i18n-polyglot';
import { Admin, CustomRoutes, Resource, localStorageStore } from 'react-admin';
import { Route } from 'react-router';

import authProvider from './authProvider';
import categories from './categories';
import { Dashboard } from './dashboard';
import dataProviderFactory from './dataProvider';
import englishMessages from './i18n/en';
import invoices from './invoices';
import { Layout, Login } from './layout';
import orders from './orders';
import products from './products';
import reviews from './reviews';
import Segments from './segments/Segments';
import visitors from './visitors';
import { ThemeContext } from './themes/themeContext';
import { useContext } from 'react';
import { ThemeContextProvider } from './themes/ThemContextProvider';

const i18nProvider = polyglotI18nProvider(
    locale => {
        if (locale === 'fr') {
            return import('./i18n/fr').then(messages => messages.default);
        }

        // Always fallback on english
        return englishMessages;
    },
    'en',
    [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' },
    ]
);

const App = () => {
    return (
        <ThemeContextProvider>
            <MyAdmin />
        </ThemeContextProvider>
    );
};

const MyAdmin = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <Admin
            title=""
            dataProvider={dataProviderFactory(
                process.env.REACT_APP_DATA_PROVIDER || ''
            )}
            store={localStorageStore(undefined, 'ECommerce')}
            authProvider={authProvider}
            dashboard={Dashboard}
            loginPage={Login}
            layout={Layout}
            i18nProvider={i18nProvider}
            disableTelemetry
            theme={theme.theme}
            lightTheme={theme.theme}
            darkTheme={theme.theme}
        >
            <CustomRoutes>
                <Route path="/segments" element={<Segments />} />
            </CustomRoutes>
            <Resource name="customers" {...visitors} />
            <Resource
                name="commands"
                {...orders}
                options={{ label: 'Orders' }}
            />
            <Resource name="invoices" {...invoices} />
            <Resource name="products" {...products} />
            <Resource name="categories" {...categories} />
            <Resource name="reviews" {...reviews} />
        </Admin>
    );
};

export default App;
