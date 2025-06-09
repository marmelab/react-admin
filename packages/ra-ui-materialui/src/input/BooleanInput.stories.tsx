import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { useFormContext } from 'react-hook-form';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { BooleanInput } from './BooleanInput';
import { TextInput } from './TextInput';
import { deepmerge } from '@mui/utils';
import { createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material';

export default { title: 'ra-ui-materialui/input/BooleanInput' };

export const Basic = () => (
    <Wrapper>
        <BooleanInput source="published" />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <BooleanInput source="published" disabled />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <BooleanInput source="published" readOnly />
    </Wrapper>
);

export const CustomIcon = () => (
    <Wrapper>
        <BooleanInput source="published" checkedIcon={<FavoriteIcon />} />
    </Wrapper>
);

export const Dark = () => (
    <Wrapper defaultTheme="dark">
        <BooleanInput source="published" />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children, defaultTheme = 'light', theme = undefined }) => (
    <AdminContext
        i18nProvider={i18nProvider}
        defaultTheme={defaultTheme as any}
        theme={theme}
    >
        <Create resource="posts">
            <SimpleForm>{children}</SimpleForm>
        </Create>
    </AdminContext>
);

const SetFocusButton = ({ source }) => {
    const { setFocus } = useFormContext();
    return (
        <button onClick={() => setFocus(source)}>Set focus on {source}</button>
    );
};

export const SetFocus = () => (
    <AdminContext defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm>
                <TextInput source="title" />
                <BooleanInput source="published" />
                <SetFocusButton source="published" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Themed = () => (
    <Wrapper
        theme={deepmerge(createTheme(), {
            components: {
                RaBooleanInput: {
                    styleOverrides: {
                        root: {
                            color: 'red',
                        },
                    },
                },
            },
        } as ThemeOptions)}
    >
        <BooleanInput source="published" />
    </Wrapper>
);
