import * as React from 'react';
import { mergeTranslations, Resource } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { Paper } from '@mui/material';
import {
    bwDarkTheme,
    bwLightTheme,
    defaultDarkTheme,
    defaultLightTheme,
} from './theme';
import { AdminContext } from './AdminContext';
import { Offline } from './Offline';

export default { title: 'ra-ui-materialui/Offline' };

export const Standard = ({ theme }) => (
    <AdminContext theme={theme}>
        <Resource
            name="posts"
            list={
                <Paper elevation={0} style={{ padding: '1em', margin: '1em' }}>
                    <Offline />
                </Paper>
            }
        />
    </AdminContext>
);

Standard.args = {
    theme: 'default-light',
};

Standard.argTypes = {
    theme: {
        control: {
            type: 'select',
        },
        options: ['default-light', 'default-dark', 'bw-light', 'bw-dark'],
        mapping: {
            'default-light': defaultLightTheme,
            'default-dark': defaultDarkTheme,
            'bw-light': bwLightTheme,
            'bw-dark': bwDarkTheme,
        },
    },
};

export const Inline = ({ theme }) => (
    <AdminContext theme={theme}>
        <Resource
            name="posts"
            list={
                <Paper elevation={0} style={{ padding: '1em', margin: '1em' }}>
                    <Offline variant="inline" />
                </Paper>
            }
        />
    </AdminContext>
);

Inline.args = {
    theme: 'default-light',
};

Inline.argTypes = {
    theme: {
        control: {
            type: 'select',
        },
        options: ['default-light', 'default-dark', 'bw-light', 'bw-dark'],
        mapping: {
            'default-light': defaultLightTheme,
            'default-dark': defaultDarkTheme,
            'bw-light': bwLightTheme,
            'bw-dark': bwDarkTheme,
        },
    },
};

export const I18n = () => (
    <AdminContext i18nProvider={polyglotI18nProvider(() => englishMessages)}>
        <Resource
            name="posts"
            list={
                <Paper elevation={0} style={{ padding: '1em', margin: '1em' }}>
                    <Offline />
                </Paper>
            }
        />
    </AdminContext>
);

export const I18nResourceSpecific = () => (
    <AdminContext
        i18nProvider={polyglotI18nProvider(() =>
            mergeTranslations(englishMessages, {
                resources: {
                    posts: {
                        notification: {
                            offline: 'No connectivity. Could not fetch posts.',
                        },
                    },
                },
            })
        )}
    >
        <Resource
            name="posts"
            list={
                <Paper elevation={0} style={{ padding: '1em', margin: '1em' }}>
                    <Offline />
                </Paper>
            }
        />
    </AdminContext>
);
