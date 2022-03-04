import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

import { AdminContext } from '../AdminContext';
import { LocalesMenuButton } from './LocalesMenuButton';
import { useTranslate } from 'ra-core';
import { Typography } from '@mui/material';

export default { title: 'ra-ui-materialui/button/LocalesMenuButton' };

const i18nProvider = polyglotI18nProvider(
    locale => (locale === 'fr' ? frenchMessages : englishMessages),
    'en' // Default locale
);

const Component = () => {
    const translate = useTranslate();

    return <Typography>{translate('ra.page.dashboard')}</Typography>;
};

export const Basic = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <LocalesMenuButton
            languages={[
                { locale: 'en', name: 'English' },
                { locale: 'fr', name: 'Français' },
            ]}
        />
        <Component />
    </AdminContext>
);
