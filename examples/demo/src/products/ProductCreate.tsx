import * as React from 'react';
import { Create, FormTab, TabbedForm, TextInput, required } from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

import { ProductEditDetails } from './ProductEditDetails';

const ProductCreate = () => {
    return (
        <Create>
            <TabbedForm defaultValues={{ sales: 0 }}>
                <FormTab
                    label="resources.products.tabs.image"
                    sx={{ maxWidth: '40em' }}
                >
                    <TextInput
                        autoFocus
                        source="image"
                        fullWidth
                        validate={required()}
                    />
                    <TextInput
                        source="thumbnail"
                        fullWidth
                        validate={required()}
                    />
                </FormTab>
                <FormTab
                    label="resources.products.tabs.details"
                    path="details"
                    sx={{ maxWidth: '40em' }}
                >
                    <ProductEditDetails />
                </FormTab>
                <FormTab
                    label="resources.products.tabs.description"
                    path="description"
                >
                    <RichTextInput source="description" label="" />
                </FormTab>
            </TabbedForm>
        </Create>
    );
};

export default ProductCreate;
