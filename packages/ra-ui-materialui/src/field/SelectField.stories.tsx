import dompurify from 'dompurify';
import { RecordContextProvider, useTimeout } from 'ra-core';
import * as React from 'react';

import { SelectField } from './SelectField';

export default {
    title: 'ra-ui-materialui/fields/SelectField',
};

const record = {
    id: 1,
    gender: 'M',
    language: 'ar',
    country: 'Albania',
};

export const Basic = () => (
    <RecordContextProvider value={record}>
        <SelectField
            source="gender"
            choices={[
                { id: 'M', name: 'Male' },
                { id: 'F', name: 'Female' },
            ]}
        />
    </RecordContextProvider>
);

const languages = [
    { id: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
    { id: 'ar', name: 'Arabic', nativeName: 'العربية' },
];
export const OptionText = () => (
    <RecordContextProvider value={record}>
        <SelectField
            source="language"
            choices={languages}
            optionText="nativeName"
        />
    </RecordContextProvider>
);

const countries = [{ name: 'Arabic', code: 'ar' }];
export const OptionValue = () => (
    <RecordContextProvider value={record}>
        <SelectField source="language" choices={countries} optionValue="code" />
    </RecordContextProvider>
);

const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
const authors = [{ id: 1, first_name: 'John', last_name: 'Doe' }];
export const Record = () => (
    <RecordContextProvider value={record}>
        <SelectField
            source="id"
            choices={authors}
            optionText={optionRenderer}
        />
    </RecordContextProvider>
);

export const TranslateChoice = () => (
    <RecordContextProvider value={record}>
        <SelectField
            source="gender"
            choices={[
                { id: 'M', name: 'myroot.gender.male' },
                { id: 'F', name: 'myroot.gender.female' },
            ]}
            translateChoice={false}
        />
    </RecordContextProvider>
);
