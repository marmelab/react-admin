import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { createTheme } from '@mui/material/styles';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { FormInspector } from './common';
import { PasswordInput } from './PasswordInput';

export default { title: 'ra-ui-materialui/input/PasswordInput' };

export const Basic = () => (
    <Wrapper>
        <PasswordInput source="password" />
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <PasswordInput source="password" fullWidth />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <PasswordInput source="password" defaultValue="password" disabled />
        <PasswordInput source="confirmedPassword" disabled />
    </Wrapper>
);
export const ReadOnly = () => (
    <Wrapper>
        <PasswordInput source="password" defaultValue="password" readOnly />
        <PasswordInput source="confirmedPassword" readOnly />
    </Wrapper>
);

export const Themed = () => (
    <Wrapper
        theme={createTheme({
            components: {
                RaPasswordInput: {
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
        <PasswordInput source="password" />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children, theme = undefined }) => (
    <AdminContext i18nProvider={i18nProvider} theme={theme}>
        <Create resource="posts">
            <SimpleForm>
                {children}
                <FormInspector name="password" />
            </SimpleForm>
        </Create>
    </AdminContext>
);
