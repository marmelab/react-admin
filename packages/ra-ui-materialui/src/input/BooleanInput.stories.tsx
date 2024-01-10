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

export const CustomIcon = () => (
    <Wrapper>
        <BooleanInput source="published" checkedIcon={<FavoriteIcon />} />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider}>
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
    <AdminContext>
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm>
                <TextInput source="title" />
                <BooleanInput source="published" />
                <SetFocusButton source="published" />
            </SimpleForm>
        </Create>
    </AdminContext>
);
