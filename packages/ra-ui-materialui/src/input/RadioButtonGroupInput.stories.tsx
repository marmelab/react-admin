import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { RadioButtonGroupInput } from './RadioButtonGroupInput';
import { FormInspector } from './common.stories';

export default { title: 'ra-ui-materialui/input/RadioButtonGroupInput' };

export const Basic = () => (
    <Wrapper>
        <RadioButtonGroupInput
            source="category"
            choices={[
                { id: 'tech', name: 'Tech' },
                { id: 'lifestyle', name: 'Lifestyle' },
                { id: 'people', name: 'People' },
            ]}
        />
    </Wrapper>
);

export const Row = () => (
    <Wrapper>
        <RadioButtonGroupInput
            source="category"
            choices={[
                { id: 'tech', name: 'Tech' },
                { id: 'lifestyle', name: 'Lifestyle' },
                { id: 'people', name: 'People' },
            ]}
            row={false}
        />
    </Wrapper>
);

export const DefaultValue = () => (
    <Wrapper>
        <RadioButtonGroupInput
            choices={[
                { id: 'M', name: 'Male' },
                { id: 'F', name: 'Female' },
            ]}
            source="gender"
        />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="posts">
            <SimpleForm>
                {children}
                <FormInspector name="gender" />
            </SimpleForm>
        </Create>
    </AdminContext>
);
