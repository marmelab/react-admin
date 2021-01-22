import * as React from 'react';
import {
    Show,
    SimpleShowLayout,
    TextField,
    TranslatableFields,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const TagShow = props => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TranslatableFields languages={['en', 'fr']}>
                <TextField source="name" />
            </TranslatableFields>
        </SimpleShowLayout>
    </Show>
);

export default TagShow;
