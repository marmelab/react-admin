import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { createTheme } from '@mui/material/styles';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { TimeInput } from './TimeInput';
import { FormInspector } from './common';

export default { title: 'ra-ui-materialui/input/TimeInput' };

export const Basic = () => (
    <Wrapper>
        <TimeInput source="published" />
    </Wrapper>
);

export const NonFullWidth = () => (
    <Wrapper>
        <TimeInput source="published" fullWidth={false} />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <TimeInput source="published" disabled />
        <TimeInput source="announcement" defaultValue="12:12" disabled />
    </Wrapper>
);
export const ReadOnly = () => (
    <Wrapper>
        <TimeInput source="published" readOnly />
        <TimeInput source="announcement" defaultValue="12:12" readOnly />
    </Wrapper>
);

export const OutlinedNoLabel = () => (
    <Wrapper>
        <TimeInput source="published" label={false} variant="outlined" />
    </Wrapper>
);

export const Themed = () => (
    <Wrapper
        theme={createTheme({
            components: {
                RaTimeInput: {
                    defaultProps: {
                        'data-testid': 'themed',
                    } as any,
                    styleOverrides: {
                        root: {
                            ['& input']: {
                                color: 'red',
                            },
                        },
                    },
                },
            },
        })}
    >
        <TimeInput source="published" />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children, theme = undefined }) => (
    <AdminContext
        i18nProvider={i18nProvider}
        defaultTheme="light"
        theme={theme}
    >
        <Create resource="posts">
            <SimpleForm>
                {children}
                <FormInspector name="published" />
            </SimpleForm>
        </Create>
    </AdminContext>
);
