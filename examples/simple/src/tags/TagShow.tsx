import * as React from 'react';
import {
    Show,
    SimpleShowLayout,
    TextField,
    TranslatableFields,
    BooleanField,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const TagShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TranslatableFields locales={['en', 'fr']}>
                <TextField source="name" />
            </TranslatableFields>
            <BooleanField source="published" />
        </SimpleShowLayout>
    </Show>
);

export default TagShow;
